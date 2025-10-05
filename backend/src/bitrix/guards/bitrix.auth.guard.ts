import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

import { BitrixAppsService } from '../services/bitrix.apps.service';
import { BitrixTokenService } from '../services/bitrix.token.service';

import { BitrixAuthDataDto } from 'src/vault/dto/vault.bitrixToken.dto';
import { BitrixCallbackAuthDataDto } from '../dto/bitrix.callbackAuth.dto';

@Injectable()
export class BitrixAuthGuard implements CanActivate {
    private readonly logger = new Logger(BitrixAuthGuard.name);

    constructor(
        private readonly tokenService: BitrixTokenService,
        private readonly bitrixAppService: BitrixAppsService
    ) { }

    private identifyPortal(applicationToken: string): number {
        const portalId = this.bitrixAppService.findPortalByAppToken(applicationToken);

        if (!portalId) throw new UnauthorizedException('Invalid Bitrix auth data');

        return portalId;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        try {
            const dto = plainToInstance(BitrixCallbackAuthDataDto, req.body.auth);
            
            await validateOrReject(dto);

            const portalId = this.identifyPortal(dto.application_token);

            const newTokens = new BitrixAuthDataDto();
            newTokens.access = dto.access_token;
            newTokens.refresh = dto.refresh_token;

            await this.tokenService.set(portalId, newTokens);

            return true;
        } catch (err) {
            this.logger.debug(`Error retrieving or validating auth data from WebHook`, err);

            if (err instanceof UnauthorizedException) throw err;
            throw new BadRequestException('Invalid Bitrix auth data')
        };
    }
}
