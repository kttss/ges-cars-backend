import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNumber,
  isNumber,
  IsString,
} from 'class-validator';
import { IsNull } from 'typeorm';

import { carburantEnum } from '../enums/carburant.enum';

export class CreateCarDto {
  @ApiProperty()
  @IsNumber()
  agence: number;

  @ApiProperty()
  @IsString()
  marque: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  matricule: string;

  @ApiProperty()
  @IsEnum(carburantEnum)
  carburant: carburantEnum;

  @ApiProperty()
  @IsString()
  statut: string;

  @ApiProperty()
  @IsString()
  @IsEmpty()
  description: string;

  @ApiProperty()
  @IsArray()
  carteGriseImages: string[];

  @ApiProperty()
  @IsDateString()
  carteGriseDateExpertation: Date;

  @ApiProperty()
  @IsArray()
  autorisationCirculationImages: string[];

  @ApiProperty()
  @IsDateString()
  autorisationCirculationDateExpertation: Date;

  @ApiProperty()
  @IsArray()
  assuranceImages: string[];

  @ApiProperty()
  @IsDateString()
  assuranceDateExpertation: Date;

  @ApiProperty()
  @IsArray()
  vignetteImages: string[];

  @ApiProperty()
  @IsDateString()
  vignetteDateExpertation: Date;

  @ApiProperty()
  @IsArray()
  visiteImages: string[];

  @ApiProperty()
  @IsDateString()
  visiteeDateExpertation: Date;
}
