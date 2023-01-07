import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/commons/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}

  @ApiOperation({ summary: 'get all channels' })
  @Get()
  getAllChannel(@Param('url') url: string, @User() user: Users) {
    return this.channelsService.getAllByUserId(url, user.id);
  }

  @ApiOperation({ summary: 'create a workspace channel' })
  @Post()
  createChannel(
    @Param('url') workspaceUrl: string,
    @Body() body: CreateChannelDto,
    @User() user: Users,
  ) {
    return this.channelsService.createWorkspaceChannel(
      workspaceUrl,
      body.name,
      user.id,
    );
  }

  @ApiOperation({ summary: 'get a channel by name' })
  @Get(':name')
  getChannel(@Param('name') name: string) {
    return this.channelsService.getChannelByName(name);
  }

  @ApiOperation({ summary: 'get members by channel name' })
  @Get(':name/members')
  getAllMember(
    @Param('url') workspaceUrl: string,
    @Param('name') channelName: string,
  ) {
    return this.channelsService.getAllMemberByName(workspaceUrl, channelName);
  }

  @ApiOperation({ summary: 'join a member into a channel' })
  @Post(':name/members')
  inviteMember(
    @Param('url') workspaceUrl: string,
    @Param('name') channelName: string,
    @Body('email') email: string,
  ) {
    return this.channelsService.createChannelMember(
      workspaceUrl,
      channelName,
      email,
    );
  }

  @Get(':name/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.PerPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':name/chats')
  postChat(@Body() body) {}
}
