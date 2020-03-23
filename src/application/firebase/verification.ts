import { IUserVerifier } from '../../core/contracts';
import { IUser } from '../../core/models';
import { auth } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { IMailService } from '../mail/mailservice';

export class UserVerifier implements IUserVerifier {

    constructor(
        private readonly fbAuth : auth.Auth,
        private readonly mailService: IMailService) {
    }

    async registerUser(user: IUser): Promise<void> {
        const link = await this.fbAuth.generateEmailVerificationLink(user.email);
        this.mailService.sendMail(user.email, 'Verify your account', `Please click on this link: ${link} \n kind regard\n Your vyzer team`);
    }
}