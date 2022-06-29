import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document } from './entities/document.entity';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car } from './entities/car.entity';
import { File } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, Document, File])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
