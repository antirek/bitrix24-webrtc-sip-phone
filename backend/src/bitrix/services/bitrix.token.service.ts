import { Injectable } from '@nestjs/common';

import { validateOrReject } from 'class-validator';
import { BitrixAuthDataDto } from 'src/vault/dto/vault.bitrixToken.dto';

import { VaultService } from 'src/vault/vault.service';

@Injectable()
export class BitrixTokenService {
    private tokens = new Map<number, BitrixAuthDataDto>();

    constructor(private readonly vaultService: VaultService) { }

    async initById(portalId: number) {
        const tokens = await this.vaultService.getBitrixAuthData(portalId);
        this.tokens.set(portalId, tokens);
    }

    async get(portalId: number): Promise<BitrixAuthDataDto | undefined> {
        let tokens;
        if (this.has(portalId)) {
            tokens = this.tokens.get(portalId)
        } else {
            tokens = await this.vaultService.getBitrixAuthData(portalId);
            if (Object.keys(tokens).length !== 0) this.tokens.set(portalId, tokens); 
        }
        return tokens;
    }

    async set(portalId: number, tokens: BitrixAuthDataDto) {
        await validateOrReject(tokens);
        
        this.tokens.set(portalId, tokens);
        this.vaultService.setBitrixAuthData(portalId, tokens);
    }

    has(portalId: number): boolean {
        return this.tokens.has(portalId);
    }

    remove(portalId: number) {
        if (this.has(portalId)) this.tokens.delete(portalId);
    }
}