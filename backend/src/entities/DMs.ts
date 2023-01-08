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
} from 'typeorm';

import { Workspaces } from './Workspaces';
import { Users } from './Users';

@Index('WorkspaceId', ['WorkspaceId'], {})
@Index('SenderId', ['SenderId'], {})
@Index('ReceiverId', ['ReceiverId'], {})
@Entity({ schema: 'slack', name: 'dms' })
export class DMs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  WorkspaceId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  SenderId: number | null; //FIXME: nullable or not?

  @Column('int', { name: 'ReceiverId', nullable: true })
  ReceiverId: number | null; //FIXME: nullable or not?

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.DMs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'WorkspaceId', referencedColumnName: 'id' })
  Workspace: Workspaces[];

  @ManyToOne(() => Users, (users) => users.DMs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SenderId', referencedColumnName: 'id' })
  Sender: Users;

  @ManyToOne(() => Users, (users) => users.DMs2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ReceiverId', referencedColumnName: 'id' })
  Receiver: Users;
}
