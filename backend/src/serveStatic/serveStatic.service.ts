import { Injectable, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class ServeStaticService {
    private readonly logger = new Logger();
    private readonly staticPath = join(process.cwd(), '..','public');

    constructor() { }

    getIndexHtml(moduleFolder): StreamableFile {
        const indexPath = join(this.staticPath, moduleFolder, 'index.html');

        this.logger.debug(`Looking for index.html at: ${ indexPath }`);

        if (!existsSync(indexPath)) {
            this.logger.error(`index.html not found at: ${ indexPath }`);
            throw new NotFoundException('index.html not found in public folder');
        }

        try {
            const file = createReadStream(indexPath);
            return new StreamableFile(file);
        } catch (error) {
            this.logger.error(`Error reading index.html: ${ error.message }`);
            throw new NotFoundException('Unable to read index.html');
        }
    }
    
    getStaticFile(relativePath: string): StreamableFile {
        const filePath = join(this.staticPath, relativePath);

        this.logger.debug(filePath);

        if (!filePath.startsWith(this.staticPath)) {
            this.logger.debug('Invalid file path');
            throw new NotFoundException('Invalid file path');
        }

        if (!existsSync(filePath)) {
            this.logger.debug('not found');
            throw new NotFoundException(`File ${ relativePath } not found`);
        }

        try {
            const file = createReadStream(filePath);
            return new StreamableFile(file);
        } catch (error) {
            this.logger.debug('Unable to read');
            throw new NotFoundException(`Unable to read ${ relativePath }`);
        }
    }

    getStaticFilePath(): string {
        return this.staticPath;
    }
}