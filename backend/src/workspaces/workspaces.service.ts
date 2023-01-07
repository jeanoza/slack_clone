import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
  ) {}

  async getById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }
  //FIXME async/await or not?
  async getAllByUserId(UserId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId }],
      },
    });
  }
  //FIXME: transaction with query runner && try, catch
  async createWorkspace(name: string, url: string, UserId: number) {
    const workspace = new Workspaces();
    workspace.name = name;
    workspace.url = url;
    workspace.OwnerId = UserId; //the create user is owner
    const workspaceReturned = await this.workspacesRepository.save(workspace);

    //#region Method I
    // const workspaceMember = new WorkspaceMembers();
    // workspaceMember.UserId = UserId;
    // workspaceMember.WorkspaceId = workspaceReturned.id;
    // await this.workspaceMembersRepository.save(workspaceMember);
    // const channel = new Channels();
    // channel.name = 'General';
    // channel.private = false;
    // channel.WorkspaceId = workspaceReturned.id;
    // const channelReturned = await this.channelsRepository.save(channel);
    //#endregion

    //#region method II
    // to save at the same time workspaceMembersRepository and channelsRepository
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = UserId;
    workspaceMember.WorkspaceId = workspaceReturned.id;
    const channel = new Channels();
    channel.name = 'General';
    channel.private = false;
    channel.WorkspaceId = workspaceReturned.id;
    const [, channelReturned] = await Promise.all([
      this.workspaceMembersRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);
    //#endregion

    const channelMember = new ChannelMembers();
    channelMember.UserId = UserId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  //Use QueryBuilder
  //FIXME async/await or not?
  async getAllWorkspaceMember(url: string) {
    // in this case, i use two oneToMany instead of ManyToMany
    // that's why i use two innerJoin
    return await this.usersRepository
      .createQueryBuilder('user') // 'user' is a alias to user table
      .innerJoin('user.WorkspaceMembers', 'members') // 'member' is a alias to user.WorkspaceMembers table
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
        //condition:string - 'workspace.url = :url' get url as a parameter
        //advantage: typeorm protect SQL Injection
      })
      .getMany();

    //getMany() && getRawMany() diff:getRawMany() return like sql join result
    //ex:
    // getMany() : {workspace:{name:Jean}}
    // getRawMany() : {'Workspace.name':Jean}
  }

  //FIXME: transaction with query runner && try, catch
  async createWorkspaceMember(url: string, email: string) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) return null;

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (chan) => chan.name === 'General',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return await this.usersRepository
      .createQueryBuilder('user')
      //protection to sql injection
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
