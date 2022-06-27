import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Agency } from './agency.entity';

@Entity()
export class Fax {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Agency, (agence) => agence.faxs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  agence: Agency;

  @Column()
  value: string;
}
