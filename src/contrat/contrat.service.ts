import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AgencyService } from '../agency/agency.service';
import { CarService } from '../car/car.service';
import { ClientService } from '../client/client.service';
import { LoggerService } from '../logger/logger.service';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';
import { Contrat } from './entities/contrat.entity';

import * as PizZip from 'pizzip';
const Docxtemplater = require('docxtemplater');
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ContratService {
  constructor(
    @InjectRepository(Contrat) private contratRepository: Repository<Contrat>,
    private agenceService: AgencyService,
    private clientService: ClientService,
    private carService: CarService,
    private readonly loggerService: LoggerService,
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

  generateContrat() {
    // Load the docx file as binary content
    const content = fs.readFileSync(
      path.resolve(__dirname, 'input.docx'),
      'binary',
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document (Replace {first_name} by John, ...)
    doc.render({
      first_name: 'John',
    });

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.

    fs.writeFileSync(path.resolve(__dirname, './../ged/output.docx'), buf);
  }
}
