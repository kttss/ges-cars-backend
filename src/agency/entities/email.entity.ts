import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agency } from './agency.entity';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agence) => agence.emails)
  @JoinTable()
  agence: Agency;

  @Column()
  email: string;
}
