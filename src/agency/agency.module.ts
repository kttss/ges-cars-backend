import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { Agency } from './entities/agency.entity';
import { Email } from './entities/email.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agency, Email])],
  controllers: [AgencyController],
  providers: [AgencyService],
})
export class AgencyModule {}
