import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Document } from './entities/document.entity';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { Car } from './entities/car.entity';
import { File } from './entities/file.entity';
import { Agency } from '../agency/entities/agency.entity';
import { AgencyService } from '../agency/agency.service';
import { AgencyModule } from '../agency/agency.module';
import { Email } from '../agency/entities/email.entity';
import { Telephone } from '../agency/entities/telephone..entity';
import { Fax } from '../agency/entities/fax.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoggerService } from '../logger/logger.service';
import { Logger } from '../logger/entities/logger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Car,
      Document,
      File,
      Agency,
      Email,
      Telephone,
      Fax,
      User,
      Logger,
    ]),
    AgencyModule,
  ],
  controllers: [CarController],
  providers: [
    CarService,
    AgencyService,
    UserService,
    JwtService,
    LoggerService,
  ],
})
export class CarModule {}
