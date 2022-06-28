import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  fistname: string;

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
  birthday: string;

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
  datePermis: string;
}
