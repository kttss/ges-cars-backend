import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { AgencyService } from '../agency/agency.service';
import { Agency } from '../agency/entities/agency.entity';
import { UserJwtDecoded } from '../auth/dto/user-jwt-decoded.dto';
import { LoggerService } from '../logger/logger.service';
import { CARS } from '../mock/car';
import { RoleEnum } from '../user/enums/role.enum';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { Document } from './entities/document.entity';
import { File } from './entities/file.entity';
import { CarStatutEnum } from './enums/car-statut.enum';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    @InjectRepository(Document)
    @InjectRepository(Agency)
    private agenceRepository: Repository<Agency>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(File) private fileRepository: Repository<File>,
    private agenceService: AgencyService,
    private readonly loggerService: LoggerService,
    private jwt: JwtService,
  ) {}

  async create(createCarDto: CreateCarDto, token?: string) {
    const {
      agence,
      marque,
      model,
      matricule,
      carburant,
      statut,
      description,
      carteGriseImages,
      carteGriseDateExpertation,
      autorisationCirculationImages,
      autorisationCirculationDateExpertation,
      assuranceImages,
      assuranceDateExpertation,
      vignetteImages,
      vignetteDateExpertation,
      visiteImages,
      visiteeDateExpertation,
      dateVidange,
    } = createCarDto;
    const car = new Car();

    const ageneceEnti = await this.agenceService.findOne(agence);

    car.agence = ageneceEnti;
    car.carburant = carburant;
    car.description = description;
    car.marque = marque;
    car.matricule = matricule;
    car.model = model;
    car.statut = statut;
    car.dateVidange = dateVidange;

    await this.carRepository.save(car);

    const carteGrise = this.saveDocument(
      car,
      carteGriseDateExpertation,
      carteGriseImages,
    );
    const autorisationCirculation = this.saveDocument(
      car,
      autorisationCirculationDateExpertation,
      autorisationCirculationImages,
    );
    const assurance = this.saveDocument(
      car,
      assuranceDateExpertation,
      assuranceImages,
    );
    const vignette = this.saveDocument(
      car,
      vignetteDateExpertation,
      vignetteImages,
    );

    car.carteGrise = await carteGrise;
    car.autorisationCirculation = await autorisationCirculation;
    car.assurance = await assurance;
    car.vignette = await vignette;

    if (visiteeDateExpertation || (visiteImages && visiteImages.length)) {
      const visite = this.saveDocument(
        car,
        visiteeDateExpertation,
        visiteImages,
      );
      car.visite = await visite;
    }
    const res = await this.carRepository.save(car);
    ageneceEnti.cars.push(car);
    await this.agenceRepository.save(ageneceEnti);

    if (token) {
      const jwtDecoded: UserJwtDecoded = this.jwt.decode(
        token.split(' ')[1],
      ) as UserJwtDecoded;
      this.loggerService.create(
        jwtDecoded,
        'a ajouter une voiture id:' + res.id,
      );
    }

    return res.id;
  }

  async findAll(token: string, dateDebut?: Date, dateFin?: Date) {
    const jwtDecoded: UserJwtDecoded = this.jwt.decode(
      token.split(' ')[1],
    ) as UserJwtDecoded;
    if (jwtDecoded.role === RoleEnum.Admin) {
      const query = this.carRepository
        .createQueryBuilder('car')
        .leftJoinAndSelect('car.carteGrise', 'carteGrise')
        .leftJoinAndSelect(
          'car.autorisationCirculation',
          'autorisationCirculation',
        )
        .leftJoinAndSelect('car.assurance', 'assurance')
        .leftJoinAndSelect('car.vignette', 'vignette')
        .leftJoinAndSelect('car.visite', 'visite')
        .leftJoinAndSelect('car.agence', 'agence')
        .leftJoinAndSelect('car.contrats', 'contrat');

      if (dateDebut && dateFin) {
        query
          .where('contrat.satrtAt <= :dateFin', { dateFin })
          .andWhere('contrat.backAt >= :dateDebut', { dateDebut });
      } else if (dateDebut) {
        query.andWhere('contrat.backAt >= :dateDebut', { dateDebut });
      } else if (dateFin) {
        query.andWhere('contrat.satrtAt <= :dateFin', { dateFin });
      }

      return query.getMany();
    } else {
      return this.findAllByAdmin(jwtDecoded.id, dateDebut, dateFin);
    }
  }

  async findAllByAdmin(id: number,dateDebut?: Date, dateFin?: Date) {
    const agences = await this.agenceService.findAllByAdmin(id);
    const agencesIds = agences.map((a) => a.id);

    const query = this.carRepository
    .createQueryBuilder('car')
    .leftJoinAndSelect('car.carteGrise', 'carteGrise')
    .leftJoinAndSelect('car.agence', 'agence')
    .leftJoinAndSelect('car.contrats', 'contrat')
    .where('car.agenceId IN (:...ids)', { ids: [...agencesIds] });

  if (dateDebut && dateFin) {
    query
      .andWhere('contrat.satrtAt <= :dateFin', { dateFin })
      .andWhere('contrat.backAt >= :dateDebut', { dateDebut });
  } else if (dateDebut) {
    query.andWhere('contrat.backAt >= :dateDebut', { dateDebut });
  } else if (dateFin) {
    query.andWhere('contrat.satrtAt <= :dateFin', { dateFin });
  }

  return query.getMany();
  }

  async findOne(id: number) {
    return await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.carteGrise', 'carteGrise')
      .leftJoinAndSelect(
        'car.autorisationCirculation',
        'autorisationCirculation',
      )
      .leftJoinAndSelect('car.assurance', 'assurance')
      .leftJoinAndSelect('car.vignette', 'vignette')
      .leftJoinAndSelect('car.visite', 'visite')
      .leftJoinAndSelect('car.agence', 'agence')
      .where({ id: id })
      .getOne();
  }

  async update(id: number, updateCarDto: UpdateCarDto, token: string) {
    const {
      marque,
      model,
      matricule,
      carburant,
      statut,
      description,
      carteGriseImages,
      carteGriseDateExpertation,
      autorisationCirculationImages,
      autorisationCirculationDateExpertation,
      assuranceImages,
      assuranceDateExpertation,
      vignetteImages,
      vignetteDateExpertation,
      visiteImages,
      visiteeDateExpertation,
      agence,
      dateVidange,
    } = updateCarDto;

    const car = await this.findOne(id);

    if (!car) {
      throw new NotFoundException('car is not found');
    }

    const ageneceEnti = await this.agenceService.findOne(agence);

    car.carburant = carburant;
    car.description = description;
    car.marque = marque;
    car.matricule = matricule;
    car.model = model;
    car.statut = statut;
    car.agence = ageneceEnti;
    car.dateVidange = dateVidange;

    // await this.documentRepository
    // .createQueryBuilder('document')
    // .leftJoinAndSelect('document.files', 'files')
    // .where({ id: id })
    // .getOne();

    const carteGriseDoc = await this.documentRepository.findOne({
      where: [{ id: car.carteGrise.id }],
    });
    const autorisationCirculationDoc = await this.documentRepository.findOne({
      where: [{ id: car.autorisationCirculation.id }],
    });
    const assuranceDoc = await this.documentRepository.findOne({
      where: [{ id: car.assurance.id }],
    });
    const vignetteDoc = await this.documentRepository.findOne({
      where: [{ id: car.vignette.id }],
    });
    const idss = [
      carteGriseDoc.id,
      autorisationCirculationDoc.id,
      assuranceDoc.id,
      vignetteDoc.id,
    ];
    let visiteDoc;
    if (car.visite) {
      visiteDoc = await this.documentRepository.findOne({
        where: [{ id: car.visite.id }],
      });
      idss.push(visiteDoc.id);
    }

    //delete old files
    this.fileRepository
      .createQueryBuilder()
      .delete()
      .from(File)
      .where('file.documentId IN (:id)', {
        id: [...idss],
      })
      .execute();

    const carteGrise = this.saveDocument(
      car,
      carteGriseDateExpertation,
      carteGriseImages,
      carteGriseDoc,
    );
    const autorisationCirculation = this.saveDocument(
      car,
      autorisationCirculationDateExpertation,
      autorisationCirculationImages,
      autorisationCirculationDoc,
    );
    const assurance = this.saveDocument(
      car,
      assuranceDateExpertation,
      assuranceImages,
      assuranceDoc,
    );
    const vignette = this.saveDocument(
      car,
      vignetteDateExpertation,
      vignetteImages,
      vignetteDoc,
    );
    if (visiteDoc) {
      const visite = this.saveDocument(
        car,
        visiteeDateExpertation,
        visiteImages,
        visiteDoc,
      );
    } else if (
      visiteeDateExpertation ||
      (visiteImages && visiteImages.length)
    ) {
      const visite = this.saveDocument(
        car,
        visiteeDateExpertation,
        visiteImages,
      );
      car.visite = await visite;
    }

    const res = await this.carRepository.save(car);
    ageneceEnti.cars.push(car);
    await this.agenceRepository.save(ageneceEnti);

    const jwtDecoded: UserJwtDecoded = this.jwt.decode(
      token.split(' ')[1],
    ) as UserJwtDecoded;
    this.loggerService.create(
      jwtDecoded,
      'est modifier une voiture id:' + res.id,
    );

    return res.id;
  }

  async remove(id: number, token: string) {
    const jwtDecoded: UserJwtDecoded = this.jwt.decode(
      token.split(' ')[1],
    ) as UserJwtDecoded;
    this.loggerService.create(jwtDecoded, 'a supprimer une voiture id:' + id);
    return this.carRepository.delete(id);
  }

  loadMockData() {
    const agenceList = CARS;
    agenceList.forEach((car: CreateCarDto) => {
      this.create(car);
    });
  }

  async saveDocument(car: Car, date: Date, files, document?) {
    const fileList = [];
    const doc = document ? document : new Document();

    doc.DateExpiration = date ? date : null;
    doc.car = car;

    files.forEach((f) => {
      const file = new File();
      file.path = f;
      fileList.push(file);
    });

    await this.fileRepository.save([...fileList]);
    doc.files = [...fileList];

    return await this.documentRepository.save(doc);
  }

  async getTotalCarsByStatut(statut: CarStatutEnum, agencesIds?: any[]) {
    return agencesIds
      ? this.carRepository
          .createQueryBuilder('car')
          .where('car.agenceId IN (:...ids)', { ids: [...agencesIds] })
          .andWhere('car.statut = :s', { s: statut })
          .getCount()
      : this.carRepository.count({ where: { statut: statut } });
  }

  async getTop(agencesIds?: any[]) {
    let cars = [];
    if (agencesIds) {
      cars = await this.carRepository
        .createQueryBuilder('car')
        .leftJoinAndSelect('car.contrats', 'contrats')
        .where('car.agenceId IN (:...ids)', { ids: [...agencesIds] })
        .getMany();
    } else {
      cars = await this.carRepository
        .createQueryBuilder('car')
        .leftJoinAndSelect('car.contrats', 'contrats')
        .getMany();
    }

    const data = [...cars].sort(
      (a, b) => b.contrats.length - a.contrats.length,
    );
    return data.slice(0, 5);
  }
}
