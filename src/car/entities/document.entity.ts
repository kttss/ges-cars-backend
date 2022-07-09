import { IsDate, IsString } from 'class-validator';
import {
  Column,
  Entity,
  IsNull,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Car } from './car.entity';
import { File } from './file.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  //   @IsDate()
  DateExpiration: string;

  @OneToMany(() => File, (file) => file.document, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  files: File[];

  //   @OneToOne(() => Car, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  //   @JoinColumn()
  //   carteGrise: Car;

  //   @OneToOne(() => Car, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  //   @JoinColumn()
  //   autorisationCirculation: Car;

  @ManyToOne(() => Client, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  client: Client;

  @ManyToOne(() => Car, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  car: Car;
}
