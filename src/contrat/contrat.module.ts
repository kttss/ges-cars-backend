import { Module } from '@nestjs/common';
import { ContratService } from './contrat.service';
import { ContratController } from './contrat.controller';

@Module({
  controllers: [ContratController],
  providers: [ContratService],
})
export class ContratModule {}
