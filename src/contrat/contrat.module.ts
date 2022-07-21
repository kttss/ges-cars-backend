import { Module } from '@nestjs/common';

import { ContratService } from './contrat.service';
import { ContratController } from './contrat.controller';
import { Contrat } from './entities/contrat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyService } from '../agency/agency.service';
import { AgencyModule } from '../agency/agency.module';
import { UserService } from '../user/user.service';
import { Agency } from '../agency/entities/agency.entity';
import { Email } from '../agency/entities/email.entity';
import { Telephone } from '../agency/entities/telephone..entity';
import { Fax } from '../agency/entities/fax.entity';
import { User } from '../user/entities/user.entity';
import { ClientModule } from '../client/client.module';
import { ClientService } from '../client/client.service';
import { File } from '../car/entities/file.entity';
import { Client } from '../client/entities/client.entity';
import { Document } from '../car/entities/document.entity';
import { CarModule } from '../car/car.module';
import { CarService } from '../car/car.service';
import { Car } from '../car/entities/car.entity';
import { LoggerService } from '../logger/logger.service';
import { Logger } from '../logger/entities/logger.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contrat,
      Agency,
      Email,
      Telephone,
      Fax,
      User,
      Client,
      File,
      Document,
      Car,
      Logger,
    ]),
    AgencyModule,
    ClientModule,
    CarModule,
  ],
  controllers: [ContratController],
  providers: [
    ContratService,
    AgencyService,
    UserService,
    ClientService,
    CarService,
    LoggerService,
    JwtService,
  ],
})
export class ContratModule {}
