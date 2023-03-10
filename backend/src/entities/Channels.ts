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
  JoinColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Workspaces } from './Workspaces';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

//TODO: without {}...?
@Index('WorkspaceId', ['WorkspaceId'], {})
@Entity({ schema: 'slack' })
export class Channels {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'General',
    description: 'channel name',
  })
  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @IsBoolean()
  @ApiProperty({
    example: 'true | false',
    description: 'current channel private option',
  })
  @Column('tinyint', {
    name: 'private',
    nullable: true,
    width: 1, //TODO: what is this?
    default: () => "'0'", // TODO: what is this?
  })
  private: boolean | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //TODO: need this?
  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  WorkspaceId: number | null;

  @OneToMany(() => ChannelChats, (channelChats) => channelChats.Channel)
  ChannelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelMembers) => channelMembers.Channel, {
    cascade: ['insert'], //FIXME: to see after
  })
  ChannelMembers: ChannelMembers[];

  // FIXME: ManyToMany => 2 OneToany...?
  // @ManyToMany(() => Users, (users) => users.Channels)
  // Members: Users[];

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.Channels, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  Workspace: Workspaces;
}
