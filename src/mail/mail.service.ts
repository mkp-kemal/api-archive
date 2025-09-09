import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
    constructor(private config: ConfigService) {
        const apiKey = config.get('SENDGRID_API_KEY');

        if (!apiKey) {
            throw new InternalServerErrorException('api key sendgrid must be set');
        }

        sgMail.setApiKey(apiKey);
    }

    async sendRegisterVerification(email: string, token: string) {
        const pageVerify = `${this.config.get('APP_URL')}/verify?token=${token}`;
        const template = {
            to: email,
            from: this.config.get('SENDGRID_FROM_EMAIL'),
            subject: "Verify Your Email",
            html: `Click <a href="${pageVerify}">here</a> to verify your email`
        };

        try {
            await sgMail.send(template);
        } catch (error) {
            throw new InternalServerErrorException(`Error sending email: ${error.message}`);
        }
    }

    async sendForgotPassword(email: string, token: string) {
        const pageVerify = `${this.config.get('APP_URL')}/reset-password?token=${token}`;
        const template = {
            to: email,
            from: this.config.get('SENDGRID_FROM_EMAIL'),
            subject: "Forgot Password Verify",
            html: `Click <a href="${pageVerify}">here</a> to set your new password`
        }

        try {
            sgMail.send(template);
        } catch (error) {
            throw new InternalServerErrorException(`Error sending email: ${error.message}`);
        }
    }
}