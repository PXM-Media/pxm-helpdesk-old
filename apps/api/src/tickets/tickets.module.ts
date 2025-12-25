import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { Ticket } from './ticket.entity';
import { Comment } from './comment.entity';
import { TicketsController } from './tickets.controller';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { EmailModule } from '../email/email.module';
import { AutomationsModule } from '../automations/automations.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, Comment]),
        forwardRef(() => EmailModule),
        forwardRef(() => AutomationsModule)
    ],
    controllers: [TicketsController, CommentsController],
    providers: [TicketsService, CommentsService],
    exports: [TicketsService, CommentsService],
})
export class TicketsModule { }
