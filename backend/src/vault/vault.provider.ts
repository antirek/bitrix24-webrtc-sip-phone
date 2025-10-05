import { Provider } from '@nestjs/common';
import vault from 'node-vault';
import type { client as VaultClient } from 'node-vault';

import { getVaultCreds } from './vault.util';

export const VaultProvider: Provider = {
  provide: 'VAULT_CLIENT',
  useFactory: async (): Promise<VaultClient> => {

    const { roleId, secretId, endpoint } = await getVaultCreds();
    
    if (!roleId || !secretId || !endpoint) {
      throw new Error('ENDPOINT, VAULT_ROLE_ID и VAULT_SECRET_ID required!');
    }

    const client = vault({
      apiVersion: 'v1',
      endpoint,
    });

    const result = await client.approleLogin({ role_id: roleId, secret_id: secretId });
    client.token = result.auth.client_token;

    return client;
  },
};
