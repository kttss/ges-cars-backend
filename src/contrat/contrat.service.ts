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
// const Docxtemplater = require('docxtemplater');
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

  async generateContrat(id: number) {
    const contrat = await this.contratRepository
      .createQueryBuilder('contrat')
      .leftJoinAndSelect('contrat.agence', 'agence')
      .leftJoinAndSelect('contrat.client', 'client')
      .leftJoinAndSelect('contrat.car', 'car')
      .where({ id: id })
      .getOne();
    const data: any = {};
    data.first_name = contrat.client.firstname;
    data.last_name = contrat.client.lastname;
    data.num = contrat.id;
    data.adresse = contrat.client.adresse;
    data.tel = contrat.client.telephone;
    data.ville_permis = contrat.client.villePermis;
    // data.date_cin = contrat.client.date
    data.cin = contrat.client.cin;
    data.date_cin = contrat.client.dateCin;
    data.permis = contrat.client.permis;
    data.marque = contrat.car.marque;
    data.model = contrat.car.model;
    data.matricule = contrat.car.matricule;
    data.carburant = contrat.car.carburant;
    data.birthday = contrat.client.birthday;
    data.birthdayPlace = contrat.client.lieuNaissance;
    data.cin_ville = contrat.client.villeCin;
    data.logo = contrat.agence.logo;
    data.agence_name = contrat.agence.name;
    data.agence_adresse = contrat.agence.adresse;

    const tels = await this.agenceService.getTelsByAgence(id);
    data.agence_tel = tels.map((e) => e.value).join(' / ');
    const faxs = await this.agenceService.getFaxsByAgence(id);
    data.agence_faxs = faxs.map((e) => e.value).join(' / ');
    const emails = await this.agenceService.getEmailsByAgence(id);
    data.agence_emails = emails.map((e) => e.value).join(' / ');
    data.price = contrat.price;

    data.start_at = contrat.satrtAt;
    data.end_at = contrat.endAt;
    data.paiement = contrat.paiement;

    data.date_ville = contrat.client.birthday;
    return data;
    // const logo = await this.getBase64FromUrl('');

    /* const i = await imageToBase64(
      'https://static.yabiladi.com/files/articles/38456_54514b2b98e5a4496b3ade499426db74_565.JPG',
    ); // Path to the image
    // .then((response) => {
    //   console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
    // })
    // .catch((error) => {
    //   console.log(error); // Logs an error if there was one
    // });
    data.logo =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QIJBywfp3IOswAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAkUlEQVQY052PMQqDQBREZ1f/d1kUm3SxkeAF/FdIjpOcw2vpKcRWCwsRPMFPsaIQSIoMr5pXDGNUFd9j8TOn7kRW71fvO5HTq6qqtnWtzh20IqE3YXtL0zyKwAROQLQ5l/c9gHjfKK6wMZjADE6s49Dver4/smEAc2CuqgwAYI5jU9NcxhHEy60sni986H9+vwG1yDHfK1jitgAAAABJRU5ErkJggg==';
    data.image = true;
    console.log('dd', i);
    // return contrat;
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
*/
    // Render the document (Replace {first_name} by John, ...)
    /* doc.render({
      first_name: 'issam',
      last_name: 'Kattouss',
      num: '0001',
      adresse: 'casa',
      tel: '0645454578',
      permis: '56478',
      ville_permis: 'casa',
      marque: 'seat',
      model: 'ibiza',
      matricule: '73788- A-06',
      carburant: 'Diesel',
      start_at: '06/06/2022',
      end_at: '12/06/2022',
      date_ville: '12/10/2020 à rabat',
      date_cin: '12/01/2018',
      cin: 'R672627',
    });*/
    /*
    doc.render(data);

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });
    */

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.

    /*
    const name =
      data.num +
      '-' +
      data.first_name.toLowerCase() +
      '-' +
      data.last_name.toLowerCase() +
      '-contrat.docx';

    fs.writeFileSync(path.resolve(__dirname, './../ged/' + name), buf);
    contrat.file = name;
    this.contratRepository.save(contrat);
    */
  }

  async getBase64FromUrl(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }
}
