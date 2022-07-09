import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { File } from '../car/entities/file.entity';
import { Document } from '../car/entities/document.entity';

@Module({
  controllers: [ClientController],
  imports: [TypeOrmModule.forFeature([Client, File, Document])],
  providers: [ClientService],
})
export class ClientModule {}
