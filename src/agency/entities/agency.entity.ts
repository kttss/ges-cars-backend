import { IsString, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Email } from './email.entity';

@Entity()
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(50)
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  adresse: string;

  @Column()
  @IsString()
  logo: string;

  @ManyToMany(() => User, (user) => user.agencys)
  @JoinTable()
  users: User[];

  @OneToMany(() => Email, (email) => email.id)
  @JoinTable()
  emails: Email[];
}
