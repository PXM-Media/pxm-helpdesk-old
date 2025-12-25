import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll() {
        // We need to add findAll to UsersService
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createAgent(@Body() body: any) {
        const { email, password, firstName, lastName, role } = body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Allow creating AGENT or ADMIN, default to AGENT if not specified
        const targetRole = role && [UserRole.AGENT, UserRole.ADMIN].includes(role) ? role : UserRole.AGENT;

        return this.usersService.create({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role: targetRole,
            isActive: true
        });
    }
}
