import { IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class BitrixAuthResponseDto {

  @IsString()
  access_token: string;

  @IsUrl()
  client_endpoint: string;

  @IsString()
  domain: string;

  @IsOptional()
  @IsNumber()
  expires_in: number;

  @IsOptional()
  @IsString()
  member_id: string;

  @IsString()
  refresh_token: string;

  @IsOptional()
  @IsString()
  scope: string;

  @IsOptional()
  @IsUrl()
  server_endpoint: string;

  @IsOptional()
  @IsString()
  status: string;
}