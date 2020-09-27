import { BaseEndpoint } from './base.endpoint';
import multer from 'multer';
import { rename, exists, mkdir, unlink } from 'fs';
import { promisify } from 'util';
import $Log from '../../utils/logger';
import { $log } from '@tsed/logger';

export class TrackEndpoint extends BaseEndpoint{

    private readonly renameAsync = promisify(rename);
    private readonly existsAsync = promisify(exists);
    private readonly mkdirAsync = promisify(mkdir);
    private tempPath: string; 

    constructor(private trackMasterPath: string, tempPath: string | undefined = undefined) {
        super('tracks');

        this.tempPath = tempPath === undefined ? trackMasterPath : tempPath;
    }

    protected initRoutes(): void {
        const upload = multer({ dest: this.tempPath });

        this.router.post('/upload/:guideId', upload.single('track'), async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).send('no track sent!');
                    return;
                }
                console.log("Upload: "+req.params.guideId);
                const guidePath = `${this.trackMasterPath}\\${req.params['guideId']}`;

                if (!await this.existsAsync(guidePath)) await this.mkdirAsync(guidePath);

                const tempPath = req.file.path;
                const targetPath = `${guidePath}\\${req.file.originalname}`;

                // rename/move the stored track to the guides folder
                await this.renameAsync(tempPath, targetPath);

                //console.log("guidePath: "+guidePath);
                //console.log("trackMasterPath: "+this.trackMasterPath);
                //console.log("req.file.originalname: "+req.file.originalname);
                console.log("targetPath: "+targetPath);
                // generate the link for the guide object
                const trackRoute = '/' + targetPath
                    .substring(targetPath.indexOf('tracks'))
                    .replace('\\', '/');

                console.log("Trackroute: "+trackRoute);

                res.status(200).send(trackRoute);
            } catch(err) {
                res.status(500).contentType('text/plain').send('Oops! An error occured, while storing the track\n error:' + err);
            }
        });
    }

}