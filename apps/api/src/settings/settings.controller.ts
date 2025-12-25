import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private settingsService: SettingsService) { }

    @Get('public')
    getPublic() {
        return this.settingsService.getPublicSettings();
    }

    @Get('admin')
    // @UseGuards(JwtAuthGuard) // Uncomment in real auth
    getAll() {
        return this.settingsService.getAllSettings();
    }

    @Post('admin')
    // @UseGuards(JwtAuthGuard)
    update(@Body() body: { settings: { key: string; value: string }[] }) {
        return this.settingsService.updateSettings(body.settings);
    }
}
