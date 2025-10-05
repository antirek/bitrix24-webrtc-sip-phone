import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BitrixCallbackAuthDataDto } from './bitrix.callbackAuth.dto';

export class CallbackEventDto {
  @IsString()
  readonly event: string;

  @ValidateNested()
  @Type(() => BitrixCallbackAuthDataDto)
  auth: BitrixCallbackAuthDataDto;
}
