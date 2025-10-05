import { Module } from '@nestjs/common';
import { ServeStaticController } from './serveStatic.controller';
import { ServeStaticService } from './serveStatic.service';

@Module({
    controllers: [ServeStaticController],
    providers: [ServeStaticService],
    exports: [ServeStaticService],
})
export class StaticFilesModule { }