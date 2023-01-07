import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Channels } from './Channels';
import { Users } from './Users';
import { WorkspaceMembers } from './WorkspaceMembers';
import { DMs } from './DMs';
import { Mentions } from './Mentions';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

@Index('name', ['name'], { unique: true })
@Index('url', ['url'], { unique: true })
@Index('OwnerId', ['OwnerId'], {})
@Entity({ schema: 'slack', name: 'workspaces' })
export class Workspaces {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'slack', description: 'workspace name' })
  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com', description: 'workspace url' })
  @Column('varchar', { name: 'url', unique: true, length: 30 })
  url: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'OwnerId', nullable: true })
  OwnerId: number | null;

  @OneToMany(() => Channels, (channels) => channels.Workspace)
  Channels: Channels[];

  @OneToMany(() => DMs, (dms) => dms.Workspace)
  DMs: DMs[];

  @OneToMany(() => Mentions, (mentions) => mentions.Workspace)
  Mentions: Mentions[];

  @OneToMany(
    () => WorkspaceMembers,
    (workspaceMembers) => workspaceMembers.Workspace,
    { cascade: ['insert'] },
  )
  WorkspaceMembers: WorkspaceMembers[];

  @ManyToOne(() => Users, (users) => users.OwnedWorkspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  Owner: Users;

  // @ManyToMany(() => Users, (users) => users.Workspaces)
  // Members: Users[];
}
