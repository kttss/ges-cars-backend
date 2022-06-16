import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  firstname: string;

  @IsString()
  @ApiProperty()
  lastname: string;

  @IsEmail()
  @ApiProperty()
  email: string;
}
