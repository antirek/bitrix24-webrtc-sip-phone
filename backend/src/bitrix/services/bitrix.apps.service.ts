import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationBootstrap
} from '@nestjs/common';

import { BitrixCreedService } from './bitrix.creed.service';
import { BitrixTokenService } from './bitrix.token.service';

import { Repository } from 'typeorm';
import { BitrixPortal } from '../entities/bitrix.portal.entity';
import { InstallCheck } from '../entities/bitrix.installCheck.entity';

import { BitrixInstallerService } from './bitrix.installer.service';
import { BitrixWidgetService } from './bitrix.widget.service';

@Injectable()
export class BitrixAppsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(BitrixAppsService.name);

  private portalsId = new Map<string, number>();

  constructor(
    @Inject('B_PORTAL_REPOSITORY') private bitrixRepository: Repository<BitrixPortal>,
    @Inject('B_INSTALL_REPOSITORY') private installCheckRepository: Repository<InstallCheck>,
    private readonly creedService: BitrixCreedService,
    private readonly tokenService: BitrixTokenService,
    private readonly bitrixInstallerService: BitrixInstallerService,
    private readonly bitrixWidgetServuce: BitrixWidgetService,
  ) { }

  private getPortalId(applicationToken: string): number | undefined {
    return this.portalsId.get(applicationToken);
  }

  private setPortalId(application_token: string, portalId: number) {
    this.portalsId.set(application_token, portalId);
  }

  private deletePortalId(application_token: string) {
    this.portalsId.delete(application_token);
  }

  //INIT
  async onApplicationBootstrap() {
    const portals = await this.bitrixRepository.find();

    portals.map(async (portal) => {
      try {
        this.tokenService.initById(portal.portalId);
        this.creedService.initById(portal.portalId);

        const applicationToken = (await this.creedService.get(portal.portalId))?.applicationToken;

        if (!applicationToken) throw new InternalServerErrorException();

        this.setPortalId(
          applicationToken,
          portal.portalId
        );
      } catch (err) {
        this.logger.debug('Error in initi');
      }

    });
  }

  findPortalByAppToken(applicationToken: string): number | undefined {
    return this.getPortalId(applicationToken);
  }

  //----------------------------------------------------------------------------------------------------------------
  async processInstall(request: any) {
    const event = request.event;
    let result;

    if (event !== 'ONAPPINSTALL') throw new BadRequestException('This endpoint is only needed for installation');

    result = await this.bitrixInstallerService.install(request);

    this.setPortalId(result.applicationToken, result.portalId);
  }

  async processUninstall(request: any) {
    const event = request.event;
    let result;

    if (event !== 'ONAPPUNINSTALL') throw new BadRequestException();

    result = await this.bitrixInstallerService.uninstall(request);

    this.deletePortalId(result.applicationToken);
    this.tokenService.remove(result.portalId);
  }

  async processRequiest(request: any) {
    const event = request?.event;

    if (!event) {
      this.logger.debug(request);
      throw new BadRequestException("Wrong request");
    }

    let result;

    switch (event) {
      case 'ONAPPINSTALL':
        throw new BadRequestException('Installation is not supported in this endpoint');
        break;
      case 'ONAPPUNINSTALL':
        this.processUninstall(request);
        break;
    }

    return result;
  }

  async processWidgetRequest(request: any) {
    //TODO AUTH
    //TODO APP ID GETTER
    //TODO VALIDATIONS
    const event = request?.event;

    this.logger.debug(request);

    if (!event) {
      
      throw new BadRequestException("Wrong request");
    }

    const portalId = 1;
    
    let result: any;

    this.logger.debug(JSON.stringify(request))

    switch (event) {
      case 'UPDATECREED':
        result = await this.bitrixWidgetServuce.updateCreed(portalId, request);
        break;
      case 'SAVEUSERDATA':
        result = await this.bitrixWidgetServuce.saveUserData(portalId, request.userId, request);
        break;
      case 'GETUSERDATA':
        result = await this.bitrixWidgetServuce.getUserData(portalId, request.userId);
        break;
      case 'GETUSERSDATA':
        result = { users: await this.bitrixWidgetServuce.getUsersData(portalId, request.usersId)};
        break;
    }

    return result;
  }
}
