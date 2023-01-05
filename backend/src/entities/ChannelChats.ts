import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Channels } from './Channels';
import { Users } from './Users';
import { Mentions } from './Mentions';

@Index('UserId', ['UserId'], {})
@Index('ChannelId', ['ChannelId'], {})
@Entity({ schema: 'slack', name: 'channelchats' })
export class ChannelChats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'ChannelId', nullable: true })
  ChannelId: number | null;

  @Column('int', { name: 'UserId', nullable: true })
  UserId: number | null;

  @OneToMany(() => Mentions, (mentions) => mentions.ChannelChat)
  Mentions: Mentions[];

  @ManyToOne(() => Channels, (channels) => channels.ChannelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ChannelId', referencedColumnName: 'id' })
  Channel: Channels;

  @ManyToOne(() => Users, (users) => users.ChannelChats, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'UserId', referencedColumnName: 'id' })
  User: Users;
}
