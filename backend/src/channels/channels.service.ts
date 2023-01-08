import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { ChannelChats } from 'src/entities/ChannelChats';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
  ) {}

  async getById(id: number) {
    return await this.channelsRepository.findOne({ where: { id } });
  }

  async getAllByUserId(url: string, userId: number) {
    return await this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :userId',
        { userId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getMany();
  }

  async getChannelByName(name: string) {
    return await this.channelsRepository.findOne({
      where: { name },
      relations: ['Workspace'],
    });
  }

  async createWorkspaceChannel(url: string, name: string, userId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });

    const channel = new Channels();
    channel.WorkspaceId = workspace.id;
    channel.name = name;
    const channelReturned = await this.channelsRepository.save(channel);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channelReturned.id;
    channelMember.UserId = userId;
    await this.channelMembersRepository.save(channelMember);
  }

  async getAllMemberByName(url: string, name: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'workspaceMembers')
      .innerJoin(
        'workspaceMembers.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .innerJoin('user.ChannelMembers', 'channelMembers')
      .innerJoin('channelMembers.Channel', 'channel', 'channel.name = :name', {
        name,
      })
      .getMany();
  }
  async createChannelMember(url: string, name: string, email: string) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    if (!channel) throw new NotFoundException('No channel exist');

    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email }) //find user by email in all workspace
      .innerJoin('user.WorkspaceMembers', 'workspaceMembers')
      .innerJoin(
        'workspaceMember.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      ) // filter user by workspace url
      .getOne();
    if (!user) throw new NotFoundException('No user exist');

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getAllChannelChat(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChat.Channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channelChats.User', 'user')
      .orderBy('channelChats.createdAt', 'DESC')
      .take(perPage) //TODO: what is this? => take == limitOfPage, ex: 20 chat by page
      .skip(perPage * (page - 1))
      .getMany();
  }
}
