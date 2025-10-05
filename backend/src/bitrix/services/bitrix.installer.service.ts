import {
    Inject,
    Injectable,
    Logger
} from "@nestjs/common";

import { BitrixTokenService } from "./bitrix.token.service";
import { BitrixHttpService } from "./bitrix.http.service";

import { Repository } from "typeorm";
import { BitrixPortal } from "../entities/bitrix.portal.entity";
import { InstallCheck } from "../entities/bitrix.installCheck.entity";

import { BitrixAuthDataDto } from "src/vault/dto/vault.bitrixToken.dto";
import { BitrixCreedDataDto } from "src/vault/dto/vault.bitrixCreed.dto";
import { DomainPortalIdDto } from "../dto/bitrix.application.dto";
import { PlacementBindDto } from "../dto/bitrix.httpClient.dto";
import { BitrixCreedService } from "./bitrix.creed.service";


@Injectable()
export class BitrixInstallerService {
    private readonly logger = new Logger(BitrixInstallerService.name);

    constructor(
        @Inject('B_PORTAL_REPOSITORY') private bitrixRepository: Repository<BitrixPortal>,
        @Inject('B_INSTALL_REPOSITORY') private installCheckRepository: Repository<InstallCheck>,
        private readonly bitrixCreedService: BitrixCreedService,
        private readonly bitrixTokenService: BitrixTokenService,
        private readonly bitrixHttpService: BitrixHttpService,
    ) { }

    private async checkForInstall(domain: string): Promise<BitrixPortal | null> {
        return this.bitrixRepository.findOneBy({ domain });;
    }

    async install(request: any): Promise<{ applicationToken: string; portalId: number }> {
        try {
            const portal = new BitrixPortal();
            const installEvent = new InstallCheck();

            const auth = request.auth;

            let portalId: number;

            const hasPortal = await this.checkForInstall(auth.domain);

            if (!hasPortal) {
                //SAVE TO DB
                portal.domain = auth.domain;
                portal.scopes = auth.scope;

                const newPortal = await this.bitrixRepository.save(portal);

                portalId = newPortal.portalId;

                installEvent.portal = newPortal;
                installEvent.event = request.event;
                installEvent.installData = request;

                await this.installCheckRepository.save(installEvent);

                //SAVE TOKENS TO VAULT
                const creeds = new BitrixCreedDataDto();
                creeds.domain = auth.domain;
                creeds.applicationToken = auth.application_token;

                await this.bitrixCreedService.set(portalId, creeds);

                const tokens = new BitrixAuthDataDto();
                tokens.access = auth.access_token;
                tokens.refresh = auth.refresh_token;

                await this.bitrixTokenService.set(portalId, tokens)

                //TODO CHECK SCOPES
                //PLACEMENT BIND
                const bitrixApplication = new DomainPortalIdDto();
                bitrixApplication.domain = auth.domain;
                bitrixApplication.portalId = portalId;
            
                const leftMenuWidget = new PlacementBindDto();
                leftMenuWidget.HANDLER = 'https://ghy380qe136na4.ru/static/widget'
                leftMenuWidget.PLACEMENT = 'LEFT_MENU';
                leftMenuWidget.TITLE = 'WebRTCSipClient'
                leftMenuWidget.OPTIONS = {
                    errorHandlerUrl: 'https://ghy380qe136na4.ru/api/bitrix/callback'
                }

                const bgWorker = new PlacementBindDto();
                bgWorker.HANDLER = 'https://ghy380qe136na4.ru/static/bgworker'
                bgWorker.PLACEMENT = 'PAGE_BACKGROUND_WORKER';
                bgWorker.TITLE = 'WebRTCSipClientBG'
                bgWorker.OPTIONS = {
                    errorHandlerUrl: 'https://ghy380qe136na4.ru/api/bitrix/callback'
                }
            
                await this.bitrixHttpService.installWidget(bitrixApplication, leftMenuWidget);
                await this.bitrixHttpService.installWidget(bitrixApplication, bgWorker);

            } else {
                portalId = hasPortal.portalId;

                //TODO CHECK AND UPDATE SCOPES
                this.logger.debug(`Already installed`);
            }
          
            return {
                applicationToken: auth.application_token,
                portalId: portalId
            };
        } catch (err) {
            this.logger.debug(`Error while install`);
            throw err;
        }
    }

    async uninstall(request: any) {
        //удалить из бд все связи
        //удалить из волта все связи
    }

}