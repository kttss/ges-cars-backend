import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Unique,
} from 'typeorm';

import { Agency } from '../../agency/entities/agency.entity';
import { Contrat } from '../../contrat/entities/contrat.entity';
import { RoleEnum } from '../enums/role.enum';

@Entity()
@Unique('my_unique_constraint', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MaxLength(50)
  @IsString()
  firstname: string;

  @Column()
  @MaxLength(50)
  @IsString()
  lastname: string;

  @Column()
  @MaxLength(50)
  @IsString()
  password: string;

  @Column({ default: true })
  @IsBoolean() 
  isActive: boolean;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;

  @Column()
  @IsPhoneNumber('MA')
  @IsNotEmpty()
  telephone: string;

  @ManyToMany(() => Agency, (agency) => agency.users, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  agencys: Agency[];
}
