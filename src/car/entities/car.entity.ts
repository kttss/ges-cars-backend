import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CarStatutEnum } from '../enums/car-statut.enum';
import { carburantEnum } from '../enums/carburant.enum';

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
}
