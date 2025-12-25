import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automation, AutomationEvent } from './automation.entity';
export { AutomationEvent };
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class AutomationsService {
    private readonly logger = new Logger(AutomationsService.name);

    constructor(
        @InjectRepository(Automation)
        private automationsRepository: Repository<Automation>,
    ) { }

    async create(data: Partial<Automation>): Promise<Automation> {
        const automation = this.automationsRepository.create(data);
        return this.automationsRepository.save(automation);
    }

    async process(ticket: Ticket, event: AutomationEvent) {
        const automations = await this.automationsRepository.find({
            where: { event, isActive: true }
        });

        for (const auto of automations) {
            if (this.checkConditions(ticket, auto.conditions)) {
                this.logger.log(`Executing automation: ${auto.name} on ticket ${ticket.id}`);
                await this.executeActions(ticket, auto.actions);
            }
        }
    }

    private checkConditions(ticket: Ticket, conditions: any[]): boolean {
        // Simple AND logic for MVP
        return conditions.every(condition => {
            const ticketValue = ticket[condition.field];
            switch (condition.operator) {
                case 'equals': return ticketValue === condition.value;
                case 'not_equals': return ticketValue !== condition.value;
                // Add more operators as needed
                default: return false;
            }
        });
    }

    private async executeActions(ticket: Ticket, actions: any[]) {
        for (const action of actions) {
            // Perform updates
            // This would ideally interact with TicketsService again, but careful of loops
            this.logger.log(`Action: ${action.action} -> ${action.value}`);
            // Mock implementation
            if (action.action === 'set_priority') {
                // ticket.priority = action.value;
                // save ticket
            }
        }
    }
}
