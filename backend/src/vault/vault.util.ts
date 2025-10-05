import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export async function getVaultCreds() {
  const logger = new Logger(getVaultCreds.name);

  const rolePath = '/creds/role_id';
  const secretPath = '/creds/secret_id';
  const endpointPath = '/creds/endpoint';

  while (true) {
    if (fs.existsSync(rolePath) && fs.existsSync(secretPath) && fs.existsSync(endpointPath)) {
      const roleId = fs.readFileSync(rolePath, 'utf8').trim();
      const secretId = fs.readFileSync(secretPath, 'utf8').trim();
      const endpoint = fs.readFileSync(endpointPath, 'utf8').trim();

      return { roleId, secretId, endpoint };
    }
    
    logger.debug(`The client waits for the dev container to initialize and for appRole tokens to be received.`);

    await new Promise((res) => setTimeout(res, 500));
  }
}