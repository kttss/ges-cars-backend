import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CARS } from '../mock/car';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { Document } from './entities/document.entity';
import { File } from './entities/file.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private carRepository: Repository<Car>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async create(createCarDto: CreateCarDto) {
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
    } = createCarDto;
    const car = new Car();

    car.carburant = carburant;
    car.description = description;
    car.marque = marque;
    car.matricule = matricule;
    car.model = model;
    car.statut = statut;

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
    const visite = this.saveDocument(car, visiteeDateExpertation, visiteImages);

    car.carteGrise = await carteGrise;
    car.autorisationCirculation = await autorisationCirculation;
    car.assurance = await assurance;
    car.vignette = await vignette;
    car.visite = await visite;

    const res = await this.carRepository.save(car);
    return res.id;
  }

  async findAll() {
    const a = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.carteGrise', 'cart')
      // .leftJoinAndSelect('.carteGrise', 'cart')
      .getMany();
    return a;
    return await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.files', 'cart')
      .getMany(); // await this.carRepository.find();
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
      .where({ id: id })
      .getOne();
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
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
    } = updateCarDto;

    const car = await this.findOne(id);

    if (!car) {
      throw new NotFoundException('car is not found');
    }

    car.carburant = carburant;
    car.description = description;
    car.marque = marque;
    car.matricule = matricule;
    car.model = model;
    car.statut = statut;

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
    const visiteDoc = await this.documentRepository.findOne({
      where: [{ id: car.visite.id }],
    });
    console.log(carteGriseDoc);

    //delete old files
    this.fileRepository
      .createQueryBuilder()
      .delete()
      .from(File)
      .where('file.documentId IN (:id)', {
        id: [
          carteGriseDoc.id,
          autorisationCirculationDoc.id,
          assuranceDoc.id,
          vignetteDoc.id,
          visiteDoc.id,
        ],
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
    const visite = this.saveDocument(
      car,
      visiteeDateExpertation,
      visiteImages,
      visiteDoc,
    );

    const res = await this.carRepository.save(car);
    return res.id;
  }

  async remove(id: number) {
    return await this.carRepository.delete(id);
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
}
