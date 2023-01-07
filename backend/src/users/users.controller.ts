import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/commons/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/commons/interceptors/undefined-to-null.interceptor';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.gaurd';

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
    return user || false;
  }

  @UseGuards(new NotLoggedInGuard())
  @ApiOperation({ summary: 'Sign in' })
  @Post()
  async join(@Body() data: JoinRequestDto) {
    await this.usersService.join(data.email, data.nickname, data.password);
    // return 'ok';
  }

  @ApiOperation({ summary: 'Log in' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: 'Log out' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    req.clearCookie('connect.sid', { httpOnly: true });
    req.send('ok');
  }
}
