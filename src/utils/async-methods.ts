import { promisify } from 'util';
import { rename, exists, mkdir, writeFile } from 'fs';

export class Files {
    static readonly renameAsync = promisify(rename);
    static readonly existsAsync = promisify(exists);
    static readonly mkdirAsync = promisify(mkdir);
    static readonly writeFileAsync = promisify(writeFile);
}
