import { HttpException, Injectable } from '@nestjs/common';
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
    if (!email) throw new HttpException('No email', 400);
    if (!nickname) throw new HttpException('No nickname', 400);
    if (!password) throw new HttpException('No password', 400);

    const user = await this.usersRpository.findOne({ where: { email } });
    if (user) throw new HttpException('User already exist', 401);

    const hashedPassword = await bcrypt.hash(password, 12);

    await this.usersRpository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
