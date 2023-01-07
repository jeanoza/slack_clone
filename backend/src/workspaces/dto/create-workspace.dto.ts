import { PickType } from '@nestjs/swagger';
import { Workspaces } from 'src/entities/Workspaces';

export class CreateWorkspaceDto extends PickType(Workspaces, [
  'name',
  'url',
] as const) {}
