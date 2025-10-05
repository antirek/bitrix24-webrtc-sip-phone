import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

import {
    Injectable,
    Logger
} from "@nestjs/common";

import { BitrixCreedService } from "./bitrix.creed.service";
import { BitrixTokenService } from "./bitrix.token.service";

import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

import {
    EventBindDto,
    PlacementBindDto
} from "../dto/bitrix.httpClient.dto";
import { DomainPortalIdDto } from "../dto/bitrix.application.dto";
import { BitrixAuthResponseDto } from "../dto/bitrix.httpResponse.dto";
import { BitrixAuthDataDto } from "src/vault/dto/vault.bitrixToken.dto";

@Injectable()
export class BitrixHttpService {
    private readonly logger = new Logger(BitrixHttpService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly bitrixCreedService: BitrixCreedService,
        private readonly bitrixTokenService: BitrixTokenService
    ) { }

    private async updateTokenRequest(portalId: number): Promise<string> {
        const url = 'https://oauth.bitrix24.tech/oauth/token/?grant_type=refresh_token';

        const applicationCreed = await this.bitrixCreedService.get(portalId);
        const applicationToken = await this.bitrixTokenService.get(portalId);

        const clientId = '&client_id=' + applicationCreed?.clientId;
        const clientSecret = '&client_secret=' + applicationCreed?.clientSecret;
        const refreshToken = '&refresh_token=' + applicationToken?.refresh;

        const response = await firstValueFrom(this.httpService.get(url + clientId + clientSecret + refreshToken));

        const dto = plainToInstance(BitrixAuthResponseDto, response);
        await validateOrReject(dto);

        const authData = new BitrixAuthDataDto();
        authData.access = dto.access_token;
        authData.refresh = dto.refresh_token;

        this.bitrixTokenService.set(portalId, authData);

        return dto.access_token;
    }

    private async sendRequest<T extends object>(
        bitrixApplication: DomainPortalIdDto,
        method: string,
        dtoClass: new () => T,
        payload: Partial<T>,
    ) {
        try {
            const url = 'https://' + bitrixApplication.domain + '/rest/' + method

            let response;

            const dto = plainToInstance(dtoClass, payload);
            await validateOrReject(dto);

            (dto as any).auth = (await this.bitrixTokenService.get(bitrixApplication.portalId))?.access;

            try {
                response = await firstValueFrom(this.httpService.post(url, dto));

            } catch (err) {
                if (err.response?.status === 403) {
                    this.logger.debug('Update token');

                    const newAuthToken = await this.updateTokenRequest(bitrixApplication.portalId);
                    (dto as any).auth = newAuthToken;

                    response = await firstValueFrom(this.httpService.post(url, dto));
                } else {
                    this.logger.debug(`Error while send request ${err} ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
                    throw new Error();
                }
            }

            return response;
        } catch (err) {
            this.logger.debug(`Error while send request ${err.response?.status}: ${JSON.stringify(err.response?.data)}`);
        }
    }

    async bindEvent(bitrixApplication: DomainPortalIdDto, payload: Partial<EventBindDto>) {
        return this.sendRequest(bitrixApplication, 'event.bind', EventBindDto, payload);
    }

    async installWidget(bitrixApplication: DomainPortalIdDto, payload: Partial<PlacementBindDto>) {
        this.logger.debug('Widget install in progress');
        return this.sendRequest(bitrixApplication, 'placement.bind', PlacementBindDto, payload);
    }
}