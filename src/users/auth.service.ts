import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // 1. See if email is in use
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // 2. Hash the password
    // 2.1. Generate salt
    const salt = randomBytes(8).toString('hex');

    // 2.2. Hash the salt and the password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join hash and salt
    const result = salt + '.' + hash.toString('hex');

    // 3. Create a new user and save it
    const newUser = await this.userService.create(email, result);

    // 4. return the user
    return newUser;
  }

  async signin(email: string, password: string) {
    // 1. See if email is in use
    // Assume only one user if email is used
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    // 2. Compare hashed password
    // 2.1. Get the salt first
    const [salt, storedHash] = user.password.split('.'); // returned value [a,b] --> a =salt , b = hash
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}
