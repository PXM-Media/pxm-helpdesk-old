import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && bcrypt.compareSync(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(email: string, pass: string, firstName: string, lastName: string) {
        const existing = await this.usersService.findOne(email);
        if (existing) {
            throw new Error('User already exists');
        }
        const hashedPassword = bcrypt.hashSync(pass, 10);
        return this.usersService.create({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role: UserRole.USER,
            isActive: true
        });
    }
}
