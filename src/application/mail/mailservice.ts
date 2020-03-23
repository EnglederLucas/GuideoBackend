import Mail from "nodemailer/lib/mailer";

export interface IMailService {
    sendMail(to: string, subject: string, text: string): Promise<void>;
}

export class FBMailService implements IMailService {

    constructor(private transporter: Mail) {
        
    }

    async sendMail(to: string, subject: string, text: string): Promise<void> {

        const mailOptions : Mail.Options = {
            to,
            subject,
            text
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }
        catch (ex) {
            throw new Error(ex.message);
        }
    }

}