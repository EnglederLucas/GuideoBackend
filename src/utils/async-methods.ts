import { promisify } from 'util';
import { rename, exists, mkdir, writeFile, rmdir, unlink, readdir, access } from 'fs';

export class Files {
    static readonly renameAsync = promisify(rename);
    static readonly existsAsync = promisify(exists);
    static readonly mkdirAsync = promisify(mkdir);
    static readonly writeFileAsync = promisify(writeFile);
    static readonly rmdirAsync = promisify(rmdir);
    static readonly unlinkAsync = promisify(unlink);
    static readonly readdirAsync = promisify(readdir);
    static readonly accessAsync = promisify(access);
}
