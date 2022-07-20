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
  // UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';

// Run CurrentUserInterceptor -> CurrentUser -> Serialize
@Controller('auth') //use auth instead
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  // Try on session
  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  //   @Get('whoami')
  //   whoAmI(@Session() session: any) {
  //     return this.userService.findOne(session.userId);
  //   }

  @Get('/whoami')
  // use decorator to prevent find null
  @UseGuards(AuthGuard) // not sigin can't get in
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  sigPut(@Session() session: any) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    // console.log(body);
    // return this.userService.create(body.email, body.password); --> plain password
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signinUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
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
