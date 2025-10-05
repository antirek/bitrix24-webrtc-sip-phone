import { Module } from '@nestjs/common';
import { VaultProvider } from './vault.provider';
import { VaultService } from './vault.service';

@Module({
    providers: [VaultProvider, VaultService],
    exports: [VaultProvider, VaultService],
})
export class VaultModule { }