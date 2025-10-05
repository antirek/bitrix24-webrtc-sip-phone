import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional, IsIn, IsObject, ValidateNested } from 'class-validator';

export class EventBindDto {
    @IsString()
    @IsIn([
        'onAppUninstall',
    ])
    event: 'onAppUninstall';

    @IsString()
    handler: 'https://api.autoazart.ru/bitrix/callback';

    @IsOptional()
    @IsInt()
    auth_type?: number;

    @IsOptional()
    @IsIn(['online', 'offline'])
    event_type?: 'online' | 'offline';

    @IsOptional()
    @IsString()
    auth_connector?: string;

    @IsOptional()
    @IsString()
    options?: string;
}

class OptionsDto {
  @IsOptional()
  @IsString()
  errorHandlerUrl?: string;
}

export class PlacementBindDto {
    @IsString()
    HANDLER: string;

    @IsOptional()
    @IsString()
    TITLE?: string;

    @IsOptional()
    @IsString()
    DESCRIPTION?: string;

    @IsString()
    @IsIn(['LEFT_MENU', 'PAGE_BACKGROUND_WORKER'])
    PLACEMENT: 'LEFT_MENU' | 'PAGE_BACKGROUND_WORKER';

    @IsOptional()
    @ValidateNested()
    @Type(() => OptionsDto)
    OPTIONS?: OptionsDto;
}
