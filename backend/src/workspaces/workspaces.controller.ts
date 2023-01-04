import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  @Get()
  getCurrentWorkspace() {}

  @Post()
  createWorkspace() {}

  @Get(':url/members')
  getAllWorkspaceMembers() {}

  @Post(':url/members')
  inviteWorkspaceMembers() {}

  @Delete(':url/members/:id')
  kickWorkspaceMember() {}

  @Get(':url/members/:id')
  getWorkspaceMemberById() {}
}
