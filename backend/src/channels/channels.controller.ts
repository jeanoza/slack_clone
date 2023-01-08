import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/commons/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { url } from 'inspector';
import { PostChatDto } from './dto/post-chat.dto';

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
  getChats(
    @Param('url') workspaceUrl: string,
    @Param('name') channelName: string,
    @Query('perPage', ParseIntPipe) perPage,
    @Query('page', ParseIntPipe) page,
  ) {
    this.channelsService.getAllChannelChat(
      workspaceUrl,
      channelName,
      perPage,
      page,
    );
  }

  @Post(':name/chats')
  postChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() body: PostChatDto,
    @User() user: Users,
  ) {
    return this.channelsService.postChat({
      url,
      content: body.content,
      name,
      userId: user.id,
    });
  }

  @Post(':name/images')
  postImages(@Body() body) {}

  @ApiOperation({ summary: 'unreads count' })
  @Get(':url/channels/:name/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('name') name,
    @Query('after', ParseIntPipe) after: number,
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }
}
