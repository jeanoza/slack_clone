import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/commons/dto/users.dto';

@ApiTags('USER')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'success',
    type: UserDto,
  })
  @ApiOperation({ summary: 'Get current user info' })
  @Get()
  getUsers(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Sign in' })
  @Post()
  postUsers(@Body() data: JoinRequestDto) {
    this.usersService.postUsers(data.email, data.nickname, data.password);
  }

  @ApiOperation({ summary: 'Log in' })
  @Post('login')
  logIn() {
    return;
  }
  @ApiOperation({ summary: 'Log out' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    req.clearCookie('connect.sid', { httpOnly: true });
    req.send('ok');
  }
}
