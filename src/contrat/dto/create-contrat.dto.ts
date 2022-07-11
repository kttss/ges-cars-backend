import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

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
  car: number;

  @ApiProperty()
  @IsDateString()
  satrtAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsDateString()
  creatAt: Date;

  @ApiProperty()
  @IsDateString()
  backAt: Date;

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
