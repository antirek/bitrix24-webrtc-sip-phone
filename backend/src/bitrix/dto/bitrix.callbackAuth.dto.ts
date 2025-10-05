import { IsString, IsOptional, IsNumberString, IsUrl } from 'class-validator';

export class BitrixCallbackAuthDataDto {
    @IsString()
    access_token: string;

    @IsString()
    refresh_token: string;

    @IsString()
    application_token: string;

    @IsUrl()
    domain: string;

    @IsString()
    scope: string;

    @IsOptional()
    @IsNumberString()
    expires: string;

    @IsOptional()
    @IsNumberString()
    expires_in: string;

    @IsOptional()
    @IsUrl()
    server_endpoint: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsUrl()
    client_endpoint: string;

    @IsOptional()
    @IsString()
    member_id: string;

    @IsOptional()
    @IsString()
    user_id: string;
}
