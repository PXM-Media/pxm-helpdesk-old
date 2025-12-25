import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { TicketsService } from './tickets.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
        @Inject(forwardRef(() => TicketsService))
        private ticketsService: TicketsService,
    ) { }

    async create(ticketId: number, user: User, content: string, isInternal: boolean = false): Promise<Comment> {
        const ticket = await this.ticketsService.findOne(ticketId);
        if (!ticket) throw new Error('Ticket not found');

        const comment = this.commentsRepository.create({
            content,
            isInternal,
            author: user,
            ticket,
        });
        return this.commentsRepository.save(comment);
    }

    async findByTicket(ticketId: number): Promise<Comment[]> {
        return this.commentsRepository.find({
            where: { ticket: { id: ticketId } },
            relations: ['author'],
            order: { createdAt: 'ASC' }
        });
    }
}
