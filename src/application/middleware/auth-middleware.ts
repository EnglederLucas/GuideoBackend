import { Request, Response, NextFunction } from 'express';
import { auth } from 'firebase-admin';
import { $Log } from '../../utils';

export async function verifyUserToken(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const token: string | undefined = req.header('token');

    if (!token) {
        const msg = 'REST: Authentication error; There was no token in the header';
        $Log.logger.error(msg);
        return res.status(401).json({ msg });
    }

    try {
        // $Log.logger.info(`Authenticate ${token}`);
        const decodedIdToken: auth.DecodedIdToken = await auth().verifyIdToken(token);
        req.params['uid'] = decodedIdToken.uid;
        next();
    } catch (err) {
        $Log.logger.error(err);
        res.status(400).send({ message: 'Invalid token' });
    }
}
