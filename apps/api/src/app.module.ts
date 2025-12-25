import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { FormsModule } from './forms/forms.module';
import { EmailModule } from './email/email.module';
import { AutomationsModule } from './automations/automations.module';
import { Ticket } from './tickets/ticket.entity';
import { User } from './users/user.entity';
import { Form } from './forms/form.entity';
import { Comment } from './tickets/comment.entity';
import { Automation } from './automations/automation.entity';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { Article, Category } from './knowledge-base/kb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportingModule } from './reporting/reporting.module';
import { SettingsModule } from './settings/settings.module';
import { Setting } from './settings/setting.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: 3306,
            username: process.env.DB_USER || 'helpdesk',
            password: process.env.DB_PASSWORD || 'helpdeskpassword',
            database: process.env.DB_NAME || 'helpdesk',
            entities: [User, Ticket, Form, Comment, Automation, Article, Category, Setting],
            synchronize: true,
        }),
        DatabaseModule,
        UsersModule,
        AuthModule,
        TicketsModule,
        FormsModule,
        EmailModule,
        AutomationsModule,
        KnowledgeBaseModule,
        ReportingModule,
        SettingsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
