import { Injectable, Logger } from "@nestjs/common";
import { BitrixCreedService } from "./bitrix.creed.service";
import { VaultService } from "src/vault/vault.service";
import { SipCreedDataDto } from "src/vault/dto/vault.sipCreed.dto";

@Injectable()
export class BitrixWidgetService {
    private readonly logger = new Logger(BitrixWidgetService.name);

    constructor(
        private readonly bitrixCreedService: BitrixCreedService,
        private readonly vaultService: VaultService,
    ) { }

    async updateCreed(portalId: number, request: any) {
        try {
            const creed = await this.bitrixCreedService.get(portalId);

            if (creed) {
                creed.clientId = request.clientId;
                creed.clientSecret = request.secretId;

                await this.bitrixCreedService.set(portalId, creed);
                this.logger.debug('Update portal creed success');
            }
        } catch (err) {
            this.logger.debug('Update portal creed error');
            throw new err;
        }
        return { status: 'ok' };
    }

    async getUsersData(portalId: number, usersId: number[]): Promise<SipCreedDataDto[]> {
        try {
            let user;
            const result = await Promise.all(
                usersId.map(async (userId) => {
                    user = await this.getUserData(portalId, userId);

                    return user;
                }),
            );

            return result;
        } catch (err) {
            this.logger.debug('Get users data error');
            throw err;
        }
    }

    async getUserData(portalId: number, userId: number) {
        let userData;

        try {
            userData = await this.vaultService.getSipUserCreedData(portalId, userId);
        } catch (err) {
            this.logger.debug('Get user data error');
        }
        return userData;
    }

    async saveUserData(portalId: number, userId: number, request: any) {
        try {
            let sipUser = new SipCreedDataDto();

            let existSipUser = await this.vaultService.getSipUserCreedData(portalId, userId);

            if (Object.keys(existSipUser).length !== 0) {
                this.logger.debug('SIP user exist, update data');
                sipUser = existSipUser;

                if (request.url !== undefined) sipUser.url = request.url;
                if (request.user !== undefined) sipUser.user = request.user;
                if (request.password !== undefined) sipUser.password = request.password;
            } else {
                if (request.userId !== undefined) sipUser.id = request.userId;
                if (request.url !== undefined) sipUser.url = request.url;
                if (request.user !== undefined) sipUser.user = request.user;
                if (request.password !== undefined) sipUser.password = request.password;
            }

            await this.vaultService.setSipUserCreedData(portalId, userId, sipUser);
        } catch (err) {
            this.logger.debug('Save user data error', err);
        }
        return { status: 'ok' };
    }
}