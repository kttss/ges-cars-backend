import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClIENTS } from '../mock/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const {
      fistname,
      adresse,
      birthday,
      lastname,
      telephone,
      lieuNaissance,
      cin,
      villeCin,
      villePermis,
      datePermis,
    } = createClientDto;

    const client = new Client();
    client.adresse = adresse;
    client.lastname = lastname;
    client.fistname = fistname;
    client.telephone = telephone;
    client.lieuNaissance = lieuNaissance;
    client.cin = cin;
    client.villeCin = villeCin;
    client.villePermis = villePermis;
    // client.datePermis = datePermis;
    // client.birthday = birthday;
    const res = await this.clientRepository.save(client);

    return res.id;
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }

  loadMockData() {
    const list = ClIENTS;
    list.forEach((a: CreateClientDto) => {
      this.create(a);
    });
  }
}
