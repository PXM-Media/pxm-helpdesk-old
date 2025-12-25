import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
    constructor(
        @InjectRepository(Setting)
        private settingsRepository: Repository<Setting>,
    ) { }

    async onModuleInit() {
        // Seed default settings if they don't exist
        await this.set('helpdesk_name', 'PXM-Helpdesk', true, 'The name of the helpdesk platform');
        await this.set('support_email', 'support@example.com', true, 'Public support contact email');
        await this.set('smtp_host', 'localhost', false, 'SMTP Server Host');
    }

    async getPublicSettings() {
        return this.settingsRepository.find({ where: { isPublic: true } });
    }

    async getAllSettings() {
        return this.settingsRepository.find();
    }

    async set(key: string, value: string, isPublic: boolean = false, description?: string) {
        const existing = await this.settingsRepository.findOne({ where: { key } });
        if (existing) {
            existing.value = value;
            existing.isPublic = isPublic;
            if (description) existing.description = description;
            return this.settingsRepository.save(existing);
        } else {
            const setting = this.settingsRepository.create({ key, value, isPublic, description });
            return this.settingsRepository.save(setting);
        }
    }

    async updateSettings(settings: { key: string; value: string }[]) {
        for (const s of settings) {
            // We only update the value, preserving other flags
            const existing = await this.settingsRepository.findOne({ where: { key: s.key } });
            if (existing) {
                existing.value = s.value;
                await this.settingsRepository.save(existing);
            }
        }
        return this.getAllSettings();
    }
}
