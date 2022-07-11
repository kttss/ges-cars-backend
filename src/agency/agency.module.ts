import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { Agency } from './entities/agency.entity';
import { Email } from './entities/email.entity';
import { UserModule } from '../user/user.module';
import { Telephone } from './entities/telephone..entity';
import { Fax } from './entities/fax.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agency, Email, Telephone, Fax]),
    UserModule,
  ],
  controllers: [AgencyController],
  providers: [AgencyService, JwtService],
})
export class AgencyModule {}
