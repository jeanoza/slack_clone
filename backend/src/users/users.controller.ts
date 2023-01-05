import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/commons/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/commons/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'success',
    type: JoinRequestDto,
  })
  @ApiOperation({ summary: 'Get current user info' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: 'Sign in' })
  @Post()
  async join(@Body() data: JoinRequestDto) {
    const result = await this.usersService.join(
      data.email,
      data.nickname,
      data.password,
    );
    // return 'ok';
  }

  @ApiOperation({ summary: 'Log in' })
  @Post('login')
  logIn(@User() user) {
    return user;
  }
  @ApiOperation({ summary: 'Log out' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    req.clearCookie('connect.sid', { httpOnly: true });
    req.send('ok');
  }
}
