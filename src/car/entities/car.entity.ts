import { IsEnum, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Agency } from '../../agency/entities/agency.entity';

import { CarStatutEnum } from '../enums/car-statut.enum';
import { carburantEnum } from '../enums/carburant.enum';
import { Document } from './document.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  marque: string;

  @Column()
  @IsString()
  model: string;

  @Column()
  @IsString()
  matricule: string;

  @Column()
  @IsEnum(carburantEnum)
  carburant: string;

  @Column()
  @IsEnum(CarStatutEnum)
  statut: string;

  @Column()
  @IsString()
  description: string;

  @OneToOne(() => Document, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  carteGrise: Document;

  @OneToOne(() => Document, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  autorisationCirculation: Document;

  @OneToOne(() => Document, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  assurance: Document;

  @OneToOne(() => Document, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  vignette: Document;

  @OneToOne(() => Document, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  visite: Document;

  @ManyToOne(() => Agency, (agence) => agence.cars, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  agence: Agency;
}
