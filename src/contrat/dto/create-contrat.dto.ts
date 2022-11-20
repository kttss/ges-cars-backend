import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaiementTypeEnum } from '../enums/paiement-type.enum';
import { ReservationStatutEnum } from '../enums/reservation-statut.enum';

export class CreateContratDto {
  @ApiProperty()
  @IsNumber()
  agence: number;

  @ApiProperty()
  @IsNumber()
  client: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  chauffeur: number;

  @ApiProperty()
  @IsNumber()
  car: number;

  @ApiProperty()
  @IsDateString()
  satrtAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  creatAt: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  backAt: Date;

  @ApiProperty()
  @IsString()
  startPlace: string;

  @ApiProperty()
  @IsString()
  endPlace: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsEnum(PaiementTypeEnum)
  paiement: PaiementTypeEnum;

  @ApiProperty()
  @IsEnum(ReservationStatutEnum)
  statut: ReservationStatutEnum;
}
