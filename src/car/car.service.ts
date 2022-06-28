import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CARS } from '../mock/car';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';

@Injectable()
export class CarService {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) {}

  async create(createCarDto: CreateCarDto) {
    const { marque, model, matricule, carburant, statut, description } =
      createCarDto;
    const car = new Car();
    car.carburant = carburant;
    car.description = description;
    car.marque = marque;
    car.matricule = matricule;
    car.model = model;
    car.statut = statut;
    const res = await this.carRepository.save(car);

    return res.id;
  }

  async findAll() {
    return await this.carRepository.find();
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
}
