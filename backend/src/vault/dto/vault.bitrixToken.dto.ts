import { IsString, IsNotEmpty } from 'class-validator';

export class BitrixAuthDataDto {
  @IsString()
  @IsNotEmpty()
  access: string;

  @IsString()
  @IsNotEmpty()
  refresh: string;
}
