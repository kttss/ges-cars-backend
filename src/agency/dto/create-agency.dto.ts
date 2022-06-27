import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, MaxLength } from 'class-validator';

export class CreateAgencyDto {
  @ApiProperty()
  @MaxLength(50)
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  adresse: string;

  @ApiProperty()
  @IsString()
  logo: string;

  @ApiProperty()
  @IsArray()
  users: number[];

  @ApiProperty()
  @IsArray()
  emails: string[];

  @ApiProperty()
  @IsArray()
  telephones: string[];

  @ApiProperty()
  @IsArray()
  faxs: string[];
}
