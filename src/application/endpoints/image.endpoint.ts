import { BaseEndpoint } from './base.endpoint';
import multer from 'multer';
import $Log from '../../utils/logger';
import { Files } from '../../utils/async-methods';

export class ImageEndpoint extends BaseEndpoint {
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
                
                const userPath = `${this.imageMasterPath}\\${req.params['userName']}`;

                if (!await Files.existsAsync(userPath)) await Files.mkdirAsync(userPath);

                const tempPath = req.file.path;
                const targetPath = `${userPath}\\${req.file.originalname}`;

                // rename/move the stored image to the users folder
                await Files.renameAsync(tempPath, targetPath);
                // await this.unlinkAsync(tempPath);

                console.log(targetPath);
                // generate the link for the guide object
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