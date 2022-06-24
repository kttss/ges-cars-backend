import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ClientModule } from './client/client.module';
import { CarModule } from './car/car.module';
import { ContratModule } from './contrat/contrat.module';
import { AuthModule } from './auth/auth.module';
import { AgencyModule } from './agency/agency.module';
import { Agency } from './agency/entities/agency.entity';
import { Client } from './client/entities/client.entity';
import { Email } from './agency/entities/email.entity';
import { Telephone } from './agency/entities/telephone..entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'cars',
      entities: [User, Agency, Client, Email, Telephone],
      synchronize: true,
      dropSchema: false,
    }),
    UserModule,
    ClientModule,
    CarModule,
    ContratModule,
    AuthModule,
    AgencyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
