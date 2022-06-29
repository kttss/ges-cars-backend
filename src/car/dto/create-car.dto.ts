import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

import { carburantEnum } from '../enums/carburant.enum';

export class CreateCarDto {
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
  description: string;

  @ApiProperty()
  @IsArray()
  carteGriseImages: string[];

  @ApiProperty()
  @IsString()
  carteGriseDateExpertation: string;

  @ApiProperty()
  @IsArray()
  autorisationCirculationImages: string[];

  @ApiProperty()
  @IsString()
  autorisationCirculationDateExpertation: string;

  @ApiProperty()
  @IsArray()
  assuranceImages: string[];

  @ApiProperty()
  @IsString()
  assuranceDateExpertation: string;

  @ApiProperty()
  @IsArray()
  vignetteImages: string[];

  @ApiProperty()
  @IsString()
  vignetteDateExpertation: string;

  @ApiProperty()
  @IsArray()
  visiteImages: string[];

  @ApiProperty()
  @IsString()
  visiteeDateExpertation: string;
}
