import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { client as VaultClient } from 'node-vault';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { DatabaseCredentialsDto } from './dto/vault.database.dto';
import { BitrixAuthDataDto } from './dto/vault.bitrixToken.dto';
import { BitrixCreedDataDto } from './dto/vault.bitrixCreed.dto';
import { SipCreedDataDto } from './dto/vault.sipCreed.dto';

@Injectable()
export class VaultService {
    private readonly logger = new Logger(VaultService.name);

    constructor(
        @Inject('VAULT_CLIENT')
        private readonly vault: VaultClient
    ) { }

    private async getValue<T extends object>(
        path: string,
        dtoClass: new () => T
    ): Promise<T> {
        try {
            const secret = await this.vault.read('secret/data/' + path);
            const data = secret.data.data;

            const dto = plainToInstance(dtoClass, data);
            await validateOrReject(dto);

            return dto;
        } catch (err) {
            this.logger.debug(`Error retrieving value from Vault [${path}]`);
            return ({} as any);
        }

    }

    private async setValue<T extends object>(
        path: string,
        dtoClass: new () => T,
        payload: Partial<T>,
    ): Promise<void> {
        try {
            const dto = plainToInstance(dtoClass, payload);
            await validateOrReject(dto);

            await this.vault.write('secret/data/' + path, { data: dto });

        } catch (err) {
            this.logger.debug(`Error saving value to Vault [${path}]`, err);
            return ({} as any);
        }
    }

    private async removeValue(path: string) {
        try {
            await this.vault.delete('secret/data/' + path);
        } catch (err) {
            this.logger.debug(`Error delete value from Vault [${path}]`);
            return ({} as any);
        }
    }

    //DATABASE CREEDENTIALS
    async getDatabaseCredentials(): Promise<DatabaseCredentialsDto> {
        return this.getValue('backend/database', DatabaseCredentialsDto);
    }

    //BITRIX APP CREEDENTIALS
    async getBitrixAuthData(id: number): Promise<BitrixAuthDataDto> {
        return this.getValue('backend/bitrix/' + id + '/auth', BitrixAuthDataDto);
    }

    async setBitrixAuthData(id: number, payload: Partial<BitrixAuthDataDto>) {
        return this.setValue('backend/bitrix/' + id + '/auth', BitrixAuthDataDto, payload);
    }

    async removeBitrixAuthData(id: number) {
        return this.removeValue('backend/bitrix/' + id + '/auth');
    }

    async getBitrixCreedData(id: number): Promise<BitrixCreedDataDto> {
        return this.getValue('backend/bitrix/' + id + '/creed', BitrixCreedDataDto);
    }

    async setBitrixCreedData(id: number, payload: Partial<BitrixCreedDataDto>) {
        return this.setValue('backend/bitrix/' + id + '/creed', BitrixCreedDataDto, payload);
    }

    async removeBitrixCreedData(id: number) {
        return this.removeValue('backend/bitrix/' + id + '/creed');
    }

    //SIP USERS CREEDENTIALS
    async getSipUserCreedData(portalId: number, userId: number): Promise<SipCreedDataDto> {
        return this.getValue('backend/sip/' + portalId + '/' + userId, SipCreedDataDto);
    }

    async setSipUserCreedData(portalId: number, userId: number, payload: Partial<SipCreedDataDto>) {
        return this.setValue('backend/sip/' + portalId + '/' + userId, SipCreedDataDto, payload);
    }

    async removeSipUserCreedData(portalId: number, userId: number) {
        return this.removeValue('backend/sip/' + portalId + '/' + userId);
    }

    async removeSipUsersCreedData(portalId: number, usersId: number[]) {
        usersId.map((userId) => {
            this.removeSipUserCreedData(portalId, userId);
        })
    }
}
