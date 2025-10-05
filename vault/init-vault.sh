#!/bin/sh
set -e

apk add --no-cache curl jq

echo "Ожидание запуска Vault..."
until curl -s "$VAULT_ADDR/v1/sys/health" >/dev/null 2>&1; do
    echo "Vault еще не готов, ждем..."
    sleep 2
done

echo "Vault запущен! Начинаем инициализацию..."

vault_api() {
    local method="$1"
    local path="$2"
    local data="$3"
    
    if [ "$method" = "GET" ]; then
        curl -s -H "X-Vault-Token: $VAULT_TOKEN" \
             "$VAULT_ADDR/v1$path"
    else
        curl -s -H "X-Vault-Token: $VAULT_TOKEN" \
             -H "Content-Type: application/json" \
             -X "$method" \
             -d "$data" \
             "$VAULT_ADDR/v1$path"
    fi
}

echo "Включение AppRole auth..."
vault_api POST "/sys/auth/approle" '{"type": "approle"}' || echo "AppRole уже включен"

echo "Создание политики backend-policy..."
POLICY_DATA='{
  "policy": "path \"secret/data/backend/*\" {\n  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\"]\n}\npath \"database/creds/backend-role\" {\n  capabilities = [\"read\"]\n}"
}'
vault_api POST "/sys/policies/acl/backend-policy" "$POLICY_DATA"

echo "Создание AppRole роли backend-role..."
ROLE_DATA='{
  "token_policies": ["backend-policy"],
  "token_ttl": "1h",
  "token_max_ttl": "4h"
}'
vault_api POST "/auth/approle/role/backend-role" "$ROLE_DATA"

echo "Создание секрета для backend/database..."
DB_SECRET='{
  "data": {
    "username": "app_db",
    "password": "000000-00000000",
    "host": "postgres",
    "port": 5432,
    "database": "app_db"
  }
}'
vault_api POST "/secret/data/backend/database" "$DB_SECRET"

echo "Получение Role ID..."
ROLE_ID=$(vault_api GET "/auth/approle/role/backend-role/role-id" | jq -r '.data.role_id')
echo "Role ID: $ROLE_ID"

echo "Создание Secret ID..."
SECRET_ID=$(vault_api POST "/auth/approle/role/backend-role/secret-id" '{}' | jq -r '.data.secret_id')
echo "Secret ID: $SECRET_ID"

echo "Тестирование доступа к секрету..."
SECRET_RESPONSE=$(vault_api GET "/secret/data/backend/database")
echo "Секрет получен: $(echo "$SECRET_RESPONSE" | jq -r '.data.data | keys[]')"


echo "$ROLE_ID" > /creds/role_id
echo "$SECRET_ID" > /creds/secret_id
echo "http://vault:8200" > /creds/endpoint
chmod -R 777 /creds

echo "Инициализация завершена!"
echo ""
echo "=== Полезная информация ==="
echo "Root Token: $VAULT_TOKEN"
echo "Role ID: $ROLE_ID"  
echo "Secret ID: $SECRET_ID"
echo ""
echo "=== Команды для проверки ==="
echo "# Логин через AppRole:"
echo "curl -X POST -d '{\"role_id\":\"$ROLE_ID\",\"secret_id\":\"$SECRET_ID\"}' $VAULT_ADDR/v1/auth/approle/login"
echo ""
echo "# Получение секрета:"
echo "curl -H 'X-Vault-Token: $VAULT_TOKEN' $VAULT_ADDR/v1/secret/data/backend/database"