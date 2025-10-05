import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BitrixCreedDataDto {
  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  clientSecret?: string;

  @IsString()
  @IsNotEmpty()
  applicationToken: string;

  @IsString()
  @IsNotEmpty()
  domain: string;
}
