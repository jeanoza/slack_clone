import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { User } from 'src/commons/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  getAllWorkspace(@User() user: Users) {
    return this.workspacesService.getAllByUserId(user.id);
  }

  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(body.name, body.url, user.id);
  }

  @Get(':url/members')
  getAllWorkspaceMembers(@Param('url') url: string) {
    return this.workspacesService.getAllWorkspaceMember(url);
  }

  @Post(':url/members')
  inviteWorkspaceMembers(@Param('url') url: string, @User() user: Users) {
    return this.workspacesService.createWorkspaceMember(url, user.email);
  }

  @Delete(':url/members/:id')
  kickWorkspaceMember() {}

  @Get(':url/members/:id')
  getWorkspaceMember(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
