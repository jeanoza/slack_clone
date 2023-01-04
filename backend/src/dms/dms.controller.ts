import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  @ApiParam({
    name: 'url',
    required: true,
    description: 'workspace url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'workspace id',
  })
  @ApiQuery({ name: 'perPage', required: true, description: 'how many pages' })
  @ApiQuery({ name: 'page', required: true, description: 'page to load' })
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    console.log(query.PerPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':id/chats')
  postChat(@Body() body) {
    return;
  }
}
