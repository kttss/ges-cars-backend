import { IsDateString, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  fistname: string;

  @Column()
  @IsString()
  lastname: string;

  @Column()
  @IsString()
  adresse: string;

  @Column()
  @IsString()
  telephone: string;

  @Column()
  @IsDateString()
  birthday: Date;

  @Column()
  @IsString()
  lieuNaissance: string;

  @Column()
  @IsString()
  cin: string;

  @Column()
  @IsString()
  villeCin: string;

  @Column()
  @IsString()
  villePermis: string;

  @Column()
  @IsDateString()
  datePermis: Date;
}
