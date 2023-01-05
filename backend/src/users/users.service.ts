import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRpository: Repository<Users>,
  ) {}
  // getUser() {}
  async join(email: string, nickname: string, password: string) {
    //validation of input-data
    // if (!email) throw new BadRequestException('No email');
    // if (!nickname) throw new BadRequestException('No nickname');
    // if (!password) throw new BadRequestException('No password');

    const user = await this.usersRpository.findOne({ where: { email } });
    if (user) throw new UnauthorizedException('User already exist');

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRpository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
