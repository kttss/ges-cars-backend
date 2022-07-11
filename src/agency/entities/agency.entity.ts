import { IsString, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from '../../car/entities/car.entity';
import { Contrat } from '../../contrat/entities/contrat.entity';

import { User } from '../../user/entities/user.entity';
import { Email } from './email.entity';
import { Fax } from './fax.entity';
import { Telephone } from './telephone..entity';

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

  @ManyToMany(() => User, (user) => user.agencys, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  users: User[];

  @OneToMany(() => Email, (email) => email.agence, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  emails: Email[];

  @OneToMany(() => Car, (car) => car.agence, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  cars: Car[];

  @OneToMany(() => Telephone, (telephone) => telephone.agence, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  telephones: Telephone[];

  @OneToMany(() => Fax, (fax) => fax.agence, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  faxs: Fax[];

  @OneToMany(() => Contrat, (contrat) => contrat.agence, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contrats: Contrat[];
}
