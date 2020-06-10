import { BaseEndpoint } from './base.endpoint';
import multer from 'multer';
import { rename, exists, mkdir, unlink } from 'fs';
import { promisify } from 'util';
import $Log from '../../utils/logger';

export class ImageEndpoint extends BaseEndpoint {

    private readonly renameAsync = promisify(rename);
    private readonly existsAsync = promisify(exists);
    private readonly mkdirAsync = promisify(mkdir);
    // private readonly unlinkAsync = promisify(unlink);
    private tempPath: string; 

    constructor(private imageMasterPath: string, tempPath: string | undefined = undefined) {
        super('images');

        this.tempPath = tempPath === undefined ? imageMasterPath : tempPath;
    }

    protected initRoutes(): void {
        const upload = multer({ dest: this.tempPath })

        this.router.post('/upload/:userName', upload.single('image'), async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).send('no image sent!');
                    return;
                }
                
                const userName = req.params['userName'];
                // $Log.logger.debug(`userName: ${userName}`);

                if (!await this.existsAsync(`${this.imageMasterPath}\\${userName}`)) {
                    await this.mkdirAsync(`${this.imageMasterPath}\\${userName}`);
                }

                const tempPath = req.file.path;
                // $Log.logger.debug(`tempPath: ${tempPath}`);
                const targetPath = `${this.imageMasterPath}\\${userName}\\${req.file.originalname}`;
                // $Log.logger.debug(`target: ${targetPath}`);

                await this.renameAsync(tempPath, targetPath);
                // await this.unlinkAsync(tempPath);

                const imageRoute = '/' + targetPath
                    .substring(targetPath.indexOf('img'))
                    .replace('\\', '/');

                res.status(200).send(imageRoute);
            } catch(err) {
                res.status(500).contentType('text/plain').send('Oops! An error occured, while storing the image\n error:' + err);
            }
        });
    }
}