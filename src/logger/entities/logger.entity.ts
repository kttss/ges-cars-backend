import { IsDateString, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  value: string;

  @Column()
  @IsDateString()
  createAt: Date;
}
