import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';
import { User } from '../users/user.entity';
import { EmailService } from '../email/email.service';
import { AutomationsService, AutomationEvent } from '../automations/automations.service';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
        @Inject(forwardRef(() => EmailService))
        private emailService: EmailService,
        @Inject(forwardRef(() => AutomationsService))
        private automationsService: AutomationsService,
    ) { }

    async create(user: User, createTicketDto: any): Promise<Ticket> {
        const ticket = this.ticketsRepository.create({
            ...createTicketDto,
            requester: user,
            status: TicketStatus.NEW
        });
        const savedTicket = await this.ticketsRepository.save(ticket);

        // Send confirmation email
        await this.emailService.sendEmail(
            user.email,
            `[#${savedTicket.id}] Ticket Received: ${savedTicket.subject}`,
            `Hello ${user.firstName},\n\nWe have received your ticket "${savedTicket.subject}". We will get back to you shortly.\n\nTicket ID: ${savedTicket.id}`
        );

        // Run Automations
        this.automationsService.process(savedTicket, AutomationEvent.TICKET_CREATED);

        return savedTicket;
    }

    async findAll(user: User): Promise<Ticket[]> {
        // If admin/agent, return all? Or filtering?
        // For MVP just return all for agents, own for users.
        if (user.role === 'USER') {
            return this.ticketsRepository.find({ where: { requester: { id: user.id } }, relations: ['requester', 'assignee'] });
        }
        return this.ticketsRepository.find({ relations: ['requester', 'assignee'] });
    }

    async findOne(id: number): Promise<Ticket> {
        return this.ticketsRepository.findOne({ where: { id }, relations: ['requester', 'assignee', 'comments', 'comments.author'] });
    }

    async update(id: number, updateTicketDto: any): Promise<Ticket> {
        await this.ticketsRepository.update(id, updateTicketDto);
        return this.findOne(id);
    }
