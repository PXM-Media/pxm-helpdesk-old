import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TicketsService } from '../tickets/tickets.service';
import { CommentsService } from '../tickets/comments.service';
import { UsersService } from '../users/users.service';
// import { connect } from 'imap-simple'; // commented out until installed and types resolved

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(
        @Inject(forwardRef(() => TicketsService))
        private ticketsService: TicketsService,
        private commentsService: CommentsService,
        private usersService: UsersService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'localhost',
            port: parseInt(process.env.SMTP_PORT) || 1025,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER || 'user',
                pass: process.env.SMTP_PASS || 'pass',
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_FROM || '"Helpdesk" <support@example.com>',
            to,
            subject,
            text,
        });
        this.logger.log(`Email sent to ${to}`);
    }

    // Placeholder for IMAP Polling
    async checkEmails() {
        // In a real implementation we would use imap-simple here
        /*
        const connection = await connect({
            imap: {
                user: process.env.IMAP_USER,
                password: process.env.IMAP_PASSWORD,
                host: process.env.IMAP_HOST,
                port: 993,
                tls: true,
                authTimeout: 3000
            }
        });
        
        await connection.openBox('INBOX');
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };
        const messages = await connection.search(searchCriteria, fetchOptions);
  
        for (const item of messages) {
            const subject = item.parts.find(p => p.which === 'HEADER').body.subject[0];
            const from = item.parts.find(p => p.which === 'HEADER').body.from[0]; // parse address
            const body = item.parts.find(p => p.which === 'TEXT').body;
  
            // Regex to find ticket ID [#123]
            const match = subject.match(/\[#(\d+)\]/);
            if (match) {
                const ticketId = parseInt(match[1]);
                // Find user by email (from)
                let user = await this.usersService.findOne(from); 
                if (!user) {
                    // create dummy user or fail?
                    // For MVP, if no user, maybe ignore or create 'Guest'
                }
                if (user) {
                    await this.commentsService.create(ticketId, user, body, false);
                }
            } else {
                // Create new ticket
                let user = await this.usersService.findOne(from);
                if (!user) {
                   // Create user logic
                }
                if (user) {
                   await this.ticketsService.create(user, { subject, description: body, priority: 'NORMAL' });
                }
            }
        }
        connection.end();
        */
        this.logger.log('Checking emails (Mock implementation due to missing deps in dev environment)...');
    }
}
