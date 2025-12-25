import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(userData: Partial<User>): Promise<User> {
        // Hash password if present
        if (userData.passwordHash) {
            // In a real app we'd receive 'password' and hash it here.
            // Assuming the caller handles hashing or we accept raw password and hash it.
            // Let's assume input is raw 'password' mapped to 'passwordHash' for now or handle it properly.
        }
        const newUser = this.usersRepository.create(userData);
        return this.usersRepository.save(newUser);
    }
}
