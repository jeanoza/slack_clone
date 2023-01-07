import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/entities/Users';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    //connect db
    queryRunner.connect();
    queryRunner.startTransaction();

    //validation of input-data => class validator in entity

    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });
    if (user) throw new UnauthorizedException('User already exist');

    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: returned.id,
        WorkspaceId: 1,
      });
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      //disconnect db
      queryRunner.release();
    }
  }
}
