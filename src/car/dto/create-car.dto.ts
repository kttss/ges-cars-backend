import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

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
}
