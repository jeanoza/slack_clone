import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @Get()
  getAllChannels() {}

  @Post()
  createChannel() {}

  @Get(':name')
  getChannelByName() {}

  @Get(':name/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.PerPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':name/chats')
  postChat(@Body() body) {}

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMembers() {}
}
