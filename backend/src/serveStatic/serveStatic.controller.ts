import {
    Controller,
    Post,
    Get,
    HttpException,
    HttpStatus,
    Header,
    Res,
    Param,
    Logger,
} from '@nestjs/common';
import { ServeStaticService } from './serveStatic.service';

@Controller('static')
export class ServeStaticController {
    private readonly logger = new Logger();

    constructor(private readonly staticFilesService: ServeStaticService) { }

    @Post('bgworker')
    @Header('Content-Type', 'text/html; charset=utf-8')
    async serveBgWorkerStatic() {
        try {
            const fileData = this.staticFilesService.getIndexHtml('bgworker');
            return fileData;
        } catch (error) {
            throw new HttpException(
                'Widget page not found',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @Post('widget')
    @Header('Content-Type', 'text/html; charset=utf-8')
    async serveWndgetStatic() {
        try {
            const fileData = this.staticFilesService.getIndexHtml('widget');
            return fileData;
        } catch (error) {
            throw new HttpException(
                'Widget page not found',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    @Get('*path')
    async serveFile(@Param('path') path: any, @Res({ passthrough: true }) res: any) {
        try {
            this.logger.debug(path);
            
            const filePath = path.join('/');

            const fileData = this.staticFilesService.getStaticFile(filePath);

            const contentType = this.getContentType(filePath);
            res.setHeader('Content-Type', contentType);
            
            return fileData;
        } catch (error) {
            throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        }
    }

    private getContentType(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase();

        const contentTypes = {
            'html': 'text/html; charset=utf-8',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'ico': 'image/x-icon',
        };

        return contentTypes[(extension as any)] || 'application/octet-stream';
    }
}