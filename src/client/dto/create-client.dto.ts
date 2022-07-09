import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsString()
  adresse: string;

  @ApiProperty()
  @IsString()
  telephone: string;

  @ApiProperty()
  @IsDateString()
  birthday: Date;

  @ApiProperty()
  @IsString()
  lieuNaissance: string;

  @ApiProperty()
  @IsString()
  cin: string;

  @ApiProperty()
  @IsString()
  villeCin: string;

  @ApiProperty()
  @IsString()
  villePermis: string;

  @ApiProperty()
  @IsDateString()
  datePermis: Date;

  @ApiProperty()
  @IsArray()
  cinImages: string[];

  @ApiProperty()
  @IsArray()
  permisImages: string[];
}
