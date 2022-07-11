import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgencyService } from '../agency/agency.service';
import { CarService } from '../car/car.service';
import { ClientService } from '../client/client.service';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';
import { Contrat } from './entities/contrat.entity';

@Injectable()
export class ContratService {
  constructor(
    @InjectRepository(Contrat) private contratRepository: Repository<Contrat>,
    private agenceService: AgencyService,
    private clientService: ClientService,
    private carService: CarService,
  ) {}

  async create(createContratDto: CreateContratDto) {
    const {
      satrtAt,
      endAt,
      creatAt,
      backAt,
      price,
      paiement,
      statut,
      agence,
      client,
      car,
    } = createContratDto;
    const contrat = new Contrat();

    const agenceEntity = await this.agenceService.findById(agence);
    const clientEntity = await this.clientService.findOne(client);
    const carEntity = await this.carService.findOne(car);

    contrat.satrtAt = satrtAt;
    contrat.endAt = endAt;
    contrat.creatAt = creatAt;
    contrat.backAt = backAt;
    contrat.paiement = paiement;
    contrat.price = Number(price);
    contrat.statut = statut;
    contrat.agence = agenceEntity;
    contrat.client = clientEntity;
    contrat.car = carEntity;
    const res = await this.contratRepository.save(contrat);

    return res.id;
  }

  async findAll() {
    return await this.contratRepository.find();
  }

  async findOne(id: number) {
    return await this.contratRepository
      .createQueryBuilder('contrat')
      .leftJoinAndSelect('contrat.agence', 'agence')
      .leftJoinAndSelect('contrat.client', 'client')
      .leftJoinAndSelect('contrat.car', 'car')
      .where({ id: id })
      .getOne();
  }

  async update(id: number, updateContratDto: UpdateContratDto) {
    const {
      satrtAt,
      endAt,
      creatAt,
      backAt,
      price,
      paiement,
      statut,
      agence,
      client,
      car,
    } = updateContratDto;

    const contrat = await this.findOne(id);

    if (!contrat) {
      throw new NotFoundException('reservation is not found');
    }

    const agenceEntity = await this.agenceService.findById(agence);
    const clientEntity = await this.clientService.findOne(client);
    const carEntity = await this.carService.findOne(car);

    contrat.satrtAt = satrtAt;
    contrat.endAt = endAt;
    contrat.creatAt = creatAt;
    contrat.backAt = backAt;
    contrat.paiement = paiement;
    contrat.price = Number(price);
    contrat.statut = statut;
    contrat.agence = agenceEntity;
    contrat.client = clientEntity;
    contrat.car = carEntity;

    const res = await this.contratRepository.save(contrat);

    return res.id;
  }

  async remove(id: number) {
    return await this.contratRepository.delete(id);
  }
}
