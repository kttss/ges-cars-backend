import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Agency } from './agency.entity';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agence) => agence.emails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  agence: Agency;

  @Column()
  value: string;
}
