import { Injectable } from '@nestjs/common';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';

@Injectable()
export class ContratService {
  create(createContratDto: CreateContratDto) {
    return 'This action adds a new contrat';
  }

  findAll() {
    return `This action returns all contrat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contrat`;
  }

  update(id: number, updateContratDto: UpdateContratDto) {
    return `This action updates a #${id} contrat`;
  }

  remove(id: number) {
    return `This action removes a #${id} contrat`;
  }
}
