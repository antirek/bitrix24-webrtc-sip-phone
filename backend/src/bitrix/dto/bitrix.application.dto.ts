import { IsString, IsNumber } from 'class-validator';

export class DomainPortalIdDto {
    @IsString()
    domain: string;

    @IsNumber()
    portalId: number;

}
