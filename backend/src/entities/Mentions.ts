import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChannelChats } from './ChannelChats';
import { Workspaces } from './Workspaces';
import { Users } from './Users';

@Index('ChatId', ['ChatId'], {})
@Index('WorkspaceId', ['WorkspaceId'], {})
@Index('SenderId', ['SenderId'], {})
@Index('ReceiverId', ['ReceiverId'], {})
@Entity({ schema: 'slack', name: 'mentions' })
export class Mentions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] })
  type: 'chat' | 'dm' | 'system';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'ChatId', nullable: true })
  ChatId: number | null;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  WorkspaceId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  SenderId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  ReceiverId: number | null;

  @ManyToOne(() => ChannelChats, (channelChats) => channelChats.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ChatId', referencedColumnName: 'id' })
  ChannelChat: ChannelChats;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'WorkspaceId', referencedColumnName: 'id' })
  Workspace: Workspaces;

  @ManyToOne(() => Users, (users) => users.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SenderId', referencedColumnName: 'id' })
  Sender: Users;

  @ManyToOne(() => Users, (users) => users.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ReceiverId', referencedColumnName: 'id' })
  Receiver: Users;
}
