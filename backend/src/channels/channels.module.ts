import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Users } from 'src/entities/Users';
import { Channels } from 'src/entities/Channels';
import { Workspaces } from 'src/entities/Workspaces';
import { ChannelChats } from 'src/entities/ChannelChats';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Channels,
      Workspaces,
      ChannelMembers,
      ChannelChats,
    ]),
  ],
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
