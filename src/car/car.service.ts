import { Injectable } from '@nestjs/common';
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
    return await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.files', 'cart')
      .getMany(); // await this.carRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} car`;
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }

  loadMockData() {
    const agenceList = CARS;
    agenceList.forEach((car: CreateCarDto) => {
      this.create(car);
    });
  }

  async saveDocument(car: Car, date: string, files) {
    const fileList = [];
    const doc = new Document();

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
