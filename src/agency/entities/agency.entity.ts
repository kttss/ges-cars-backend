import { IsString, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(50)
  @IsString()
  name: string;

  @ManyToMany(() => User, (user) => user.agencys)
  @JoinTable()
  users: User[];
}
