import {
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Agency } from '../../agency/entities/agency.entity';
import { Car } from '../../car/entities/car.entity';
import { Client } from '../../client/entities/client.entity';
import { PaiementTypeEnum } from '../enums/paiement-type.enum';
import { ReservationStatutEnum } from '../enums/reservation-statut.enum';

@Entity()
export class Contrat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDateString()
  satrtAt: Date;

  @Column()
  @IsDateString()
  endAt: Date;

  @Column()
  @IsDateString()
  creatAt: Date;

  @Column()
  @IsDateString()
  backAt: Date;

  @Column()
  @IsNumber()
  price: number;

  @Column()
  @IsEnum(PaiementTypeEnum)
  paiement: PaiementTypeEnum;

  @Column()
  @IsEnum(ReservationStatutEnum)
  statut: ReservationStatutEnum;

  @ManyToOne(() => Client, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  client: Client;

  @ManyToOne(() => Client, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  chauffeur: Client;

  @ManyToOne(() => Agency, (agence) => agence.contrats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  agence: Agency;

  @ManyToOne(() => Car, (car) => car.contrats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  car: Car;

  @Column()
  @IsString()
  @IsEmpty()
  file: string;
}
