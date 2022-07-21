import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { Agency } from './entities/agency.entity';
import { Email } from './entities/email.entity';
import { UserModule } from '../user/user.module';
import { Telephone } from './entities/telephone..entity';
import { Fax } from './entities/fax.entity';
import { LoggerService } from '../logger/logger.service';
import { LoggerModule } from '../logger/logger.module';
import { Logger } from '../logger/entities/logger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agency, Email, Telephone, Fax, Logger]),
    UserModule,
    LoggerModule,
  ],
  controllers: [AgencyController],
  providers: [AgencyService, JwtService, LoggerService],
})
export class AgencyModule {}
