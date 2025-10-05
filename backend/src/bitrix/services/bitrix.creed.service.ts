import { Injectable } from '@nestjs/common';

import { validateOrReject } from 'class-validator';
import { BitrixCreedDataDto } from 'src/vault/dto/vault.bitrixCreed.dto';

import { VaultService } from 'src/vault/vault.service';

@Injectable()
export class BitrixCreedService {
    private creeds = new Map<number, BitrixCreedDataDto>();

    constructor(private readonly vaultService: VaultService) { }

    async initById(portalId: number) {
        const creeds = await this.vaultService.getBitrixCreedData(portalId);
        this.creeds.set(portalId, creeds);
    }

    async get(portalId: number): Promise<BitrixCreedDataDto | undefined> {
        let creeds;
        if (this.has(portalId)) {
            creeds = this.creeds.get(portalId)
        } else {
            creeds = await this.vaultService.getBitrixCreedData(portalId);
            if (Object.keys(creeds).length !== 0) this.creeds.set(portalId, creeds); 
        }
        return creeds;
    }

    async set(portalId: number, creeds: BitrixCreedDataDto) {
        await validateOrReject(creeds);
        
        this.creeds.set(portalId, creeds);
        this.vaultService.setBitrixCreedData(portalId, creeds);
    }

    has(portalId: number): boolean {
        return this.creeds.has(portalId);
    }

    remove(portalId: number) {
        if (this.has(portalId)) this.creeds.delete(portalId);
    }
}