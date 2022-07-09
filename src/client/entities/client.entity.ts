import { IsDateString, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from '../../car/entities/document.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  firstname: string;

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

  @OneToOne(() => Document, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  cinFiles: Document;

  @OneToOne(() => Document, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  permisFiles: Document;
}
