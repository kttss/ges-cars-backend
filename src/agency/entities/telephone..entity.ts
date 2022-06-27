import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Agency } from './agency.entity';

@Entity()
export class Telephone {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agence) => agence.telephones, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  agence: Agency;

  @Column()
  value: string;
}
