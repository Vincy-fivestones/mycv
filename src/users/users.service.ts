import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOne({ where: { id: id } });
  }

  find(email: string) {
    return this.userRepository.find({
      where: {
        email: email,
      },
    });
  }

  async update(id: number, attrs: Partial<User>) {
    // Partial -->has partial property of user
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      // throw new Error('user not found');
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs); // overwrite all property from attrs to user
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      // throw new Error('user not found');
      throw new NotFoundException('user not found');
    }
    return this.userRepository.remove(user);
  }
}

// const usersService = new UsersService({} as any);
// usersService;
