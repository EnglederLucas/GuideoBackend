import { Request, Response, NextFunction } from 'express';
import { auth } from 'firebase-admin';

export async function verifyUserToken(req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const token: string | undefined = req.header("token");

    if (!token) {
        return res.status(401).json({ message: "REST: Authentication error" });
    }

    try {
        const decodedIdToken: auth.DecodedIdToken = await auth().verifyIdToken(token);
        req.params['uid'] = decodedIdToken.uid;
        next();
    } catch(err) {
        console.error(err)
        res.status(500).send({ message: "Invalid token"});
    }
}

// this.app.use('/guides/*', async (req, res, next) => {
//     // get id token
//     const idToken: string = "";
//     let success = true;
//     let err = Error("nothing set");

//     try {
//         const decodedIdToken: auth.DecodedIdToken = await auth().verifyIdToken(idToken);
//         const uid: string = decodedIdToken.uid;
//         req.params.uid = uid;
//     } catch (error) {
//         success = false;
//         err.message = "Token not valid!";
//     }
    
//     if (success) next(err)
// }); 