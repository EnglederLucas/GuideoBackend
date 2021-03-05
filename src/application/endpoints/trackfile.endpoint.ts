import { BaseEndpoint } from './base.endpoint';
import multer from 'multer';
import { Files, $Log } from '../../utils';
import config from '../../config';
import { verifyUserToken } from '../middleware';

export class TrackEndpoint extends BaseEndpoint {
    private tempPath: string;

    constructor(private trackMasterPath: string, tempPath: string | undefined = undefined) {
        super('trackfiles');

        this.tempPath = tempPath === undefined ? trackMasterPath : tempPath;
    }

    protected initRoutes(): void {
        const upload = multer({ dest: this.tempPath });

        this.router.use('/upload/', verifyUserToken);

        this.router.post('/upload/', upload.single('track'), async (req, res) => {
            try {
                if (!req.file) {
                    res.status(400).send('no track sent!');
                    return;
                }
                const userPath = `${this.trackMasterPath}/${req.query.username}`;
                const guidePath = `${userPath}/${req.query.guideId}`;

                if (!(await Files.existsAsync(userPath))) await Files.mkdirAsync(userPath);
                if (!(await Files.existsAsync(guidePath))) await Files.mkdirAsync(guidePath);

                const tempPath = req.file.path;
                const targetPath = `${guidePath}/${req.file.originalname}`;

                // rename/move the stored track to the guides folder
                await Files.renameAsync(tempPath, targetPath);

                // generate the link for the guide object
                const trackRoute = '/' + targetPath.substring(targetPath.indexOf('tracks')).replace('\\', '/');

                const fileName = req.file.filename;
                var mp3Duration = require('mp3-duration');

                const trackLength = await mp3Duration(targetPath);
                const resObject = { fileName, trackLength, trackRoute };

                res.status(200).send(resObject);
            } catch (err) {
                res.status(500)
                    .contentType('text/plain')
                    .send('Oops! An error occured, while storing the track\n error:' + err);
            }
        });
    }
}
