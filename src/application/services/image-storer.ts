import { IImageStorer } from '../../core/contracts';
import { promisify } from 'util';
import { writeFile } from 'fs';

export class ImageStorer implements IImageStorer {
    private readonly storeFile = promisify(writeFile);

    constructor(private readonly imageMasterPath: string) {
    }

    async storeImage(path: string, data: any): Promise<void> {
        await this.storeFile(`${this.imageMasterPath}\\${path}`, data);
    }

}