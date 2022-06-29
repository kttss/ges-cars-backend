import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  path: string;

  @ManyToOne(() => Document, (document) => document.files, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  document: Document;
}
