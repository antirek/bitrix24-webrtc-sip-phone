import { 
  Body, 
  Controller, 
  Post, 
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { BitrixAppsService } from './services/bitrix.apps.service';
import { BitrixAuthGuard } from './guards/bitrix.auth.guard';

import { CallbackEventDto } from './dto/bitrix.callbackEvent.dto';

@Controller('api/bitrix')
export class BitrixController {
  constructor(
    private readonly bitrixAppsService: BitrixAppsService
  ) { }

  @Post('install')
  @UsePipes(new ValidationPipe())
  install(@Body() dto: CallbackEventDto) {
    return this.bitrixAppsService.processInstall(dto);
  }

  @Post('callback')
  @UseGuards(BitrixAuthGuard)
  @UsePipes(new ValidationPipe())
  processRequiest(@Body() dto: CallbackEventDto): Promise<any> {
    return this.bitrixAppsService.processRequiest(dto);
  }

  @Post('widget')
  //TODO GUARD AND VALIDATE
  widgetRequiest(@Body() data: any): Promise<any> {
    return this.bitrixAppsService.processWidgetRequest(data);
  }
}
