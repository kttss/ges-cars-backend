import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

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
import { CarStatutEnum } from '../car/enums/car-statut.enum';
import { RoleEnum } from '../user/enums/role.enum';
import { UserJwtDecoded } from '../auth/dto/user-jwt-decoded.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ContratService {
  constructor(
    @InjectRepository(Contrat) private contratRepository: Repository<Contrat>,
    private agenceService: AgencyService,
    private clientService: ClientService,
    private carService: CarService,
    private readonly loggerService: LoggerService,
    private jwt: JwtService,
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

  async findAll(token?: string) {
    const jwtDecoded: UserJwtDecoded = this.jwt.decode(
      token.split(' ')[1],
    ) as UserJwtDecoded;
    if (jwtDecoded.role === RoleEnum.Admin) {
      return this.contratRepository.find();
    } else {
      return this.findAllByAdmin(jwtDecoded.id);
    }
  }

  async findAllByAdmin(id: number) {
    const agences = await this.agenceService.findAllByAdmin(id);
    const agencesIds = agences.map((a) => a.id);

    return this.contratRepository
      .createQueryBuilder('contrat')
      .where('contrat.agenceId IN (:...ids)', { ids: [...agencesIds] })
      .getMany();
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

  async getstatistique(token?: string) {
    // await

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let agencesIds = null;
    const jwtDecoded: UserJwtDecoded = this.jwt.decode(
      token.split(' ')[1],
    ) as UserJwtDecoded;
    if (jwtDecoded.role !== RoleEnum.Admin) {
      const agences = await this.agenceService.findAllByAdmin(jwtDecoded.id);
      agencesIds = agences.map((a) => a.id);
    }

    const totalOfReservationInThisMonth = agencesIds
      ? await this.contratRepository
          .createQueryBuilder('contrat')
          .where({ satrtAt: Between(firstDay, lastDay) })
          .where('contrat.agenceId IN (:...ids)', { ids: [...agencesIds] })
          .getCount()
      : await this.contratRepository
          .createQueryBuilder('contrat')
          .where({ satrtAt: Between(firstDay, lastDay) })
          .getCount();

    const totalOfReservationInThisYear = agencesIds
      ? await this.contratRepository
          .createQueryBuilder('contrat')
          .where({
            satrtAt: Between(
              new Date('01-01-' + date.getFullYear()),
              new Date('12-31-' + date.getFullYear()),
            ),
          })
          .where('contrat.agenceId IN (:...ids)', { ids: [...agencesIds] })
          .getCount()
      : await this.contratRepository
          .createQueryBuilder('contrat')
          .where({
            satrtAt: Between(
              new Date('01-01-' + date.getFullYear()),
              new Date('12-31-' + date.getFullYear()),
            ),
          })
          .getCount();

    const totalDisponible = await this.carService.getTotalCarsByStatut(
      CarStatutEnum.Disponible,
      agencesIds,
    );
    const totalPanne = await this.carService.getTotalCarsByStatut(
      CarStatutEnum.Panne,
      agencesIds,
    );
    const totalReserved = await this.carService.getTotalCarsByStatut(
      CarStatutEnum.Reserved,
      agencesIds,
    );

    const top = await this.carService.getTop(agencesIds);

    return {
      totalMonth: totalOfReservationInThisMonth,
      totalYear: totalOfReservationInThisYear,
      totalDisponible,
      totalPanne,
      totalReserved,
      top,
    };
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
