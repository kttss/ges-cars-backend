import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { File } from '../car/entities/file.entity';
import { Document } from '../car/entities/document.entity';

import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [ClientController],
  imports: [TypeOrmModule.forFeature([Client, File, Document]), LoggerModule],
  providers: [ClientService, JwtService],
})
export class ClientModule {}
