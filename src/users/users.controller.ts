import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth') //use auth instead
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  // Try on session
  //   @Get('/colors/:color')
  //   setColor(@Param('color') color: string, @Session() session: any) {
  //     session.color = color;
  //   }

  //   @Get('/colors')
  //   getColor(@Session() session: any) {
  //     return session.color;
  //   }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    // console.log(body);
    // return this.userService.create(body.email, body.password); --> plain password
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  signinUser(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  // @UseInterceptors(ClassSerializerInterceptor) --> Use entity
  // Below to long
  // @UseInterceptors(new SerializeInterceptor(UserDto)) // Custom serializer
  // @Serialize(UserDto) -- only for one route
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // console.log('handler is running');
    const user = await this.userService.findOne(parseInt(id));
    //return this.userService.findOne(parseInt(id));

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // delete user.password;
    return user;
  }

  @Get()
  findAllUser(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
