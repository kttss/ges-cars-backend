import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserJwtDecoded } from '../auth/dto/user-jwt-decoded.dto';
import { Logger } from './entities/logger.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger) private LoggerRepository: Repository<Logger>,
  ) {}

  create(user: UserJwtDecoded, value: string): void {
    const log = new Logger();
    log.value =
      'utilisateur id=' +
      user.id +
      ' ' +
      user.lastname +
      ' ' +
      user.firstname +
      ' ' +
      value;
    log.createAt = new Date();
    this.LoggerRepository.save(log);
  }

  async getAll() {
    return await this.LoggerRepository.find();
  }
}
