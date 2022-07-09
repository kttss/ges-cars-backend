import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../car/entities/document.entity';
import { File } from '../car/entities/file.entity';
import { ClIENTS } from '../mock/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const {
      firstname,
      adresse,
      birthday,
      lastname,
      telephone,
      lieuNaissance,
      cin,
      villeCin,
      villePermis,
      datePermis,
      cinImages,
      permisImages,
    } = createClientDto;

    const client = new Client();
    client.adresse = adresse;
    client.lastname = lastname;
    client.firstname = firstname;
    client.telephone = telephone;
    client.lieuNaissance = lieuNaissance;
    client.cin = cin;
    client.villeCin = villeCin;
    client.villePermis = villePermis;
    client.datePermis = datePermis;
    client.birthday = birthday;

    const res = await this.clientRepository.save(client);

    const fileCinList = [];
    const cindoc = new Document();

    cindoc.DateExpiration = null;
    cindoc.client = client;
    cinImages.forEach((f) => {
      const file = new File();
      file.path = f;
      fileCinList.push(file);
    });
    await this.fileRepository.save([...fileCinList]);
    cindoc.files = [...fileCinList];
    await this.documentRepository.save(cindoc);
    client.cinFiles = cindoc;
    const filePermisList = [];
    const permisdoc = new Document();

    permisdoc.DateExpiration = null;
    permisdoc.client = client;
    permisImages.forEach((f) => {
      const file = new File();
      file.path = f;
      filePermisList.push(file);
    });
    await this.fileRepository.save([...filePermisList]);
    permisdoc.files = [...filePermisList];
    await this.documentRepository.save(permisdoc);
    client.permisFiles = permisdoc;
    await this.clientRepository.save(client);
    return res.id;
  }

  findAll() {
    return this.clientRepository.find();
  }

  async findOne(id: number) {
    return await this.clientRepository.findOne({
      where: [{ id: id }],
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const {
      firstname,
      adresse,
      birthday,
      lastname,
      telephone,
      lieuNaissance,
      cin,
      villeCin,
      villePermis,
      datePermis,
    } = updateClientDto;

    const client = await this.findOne(id);

    if (!client) {
      throw new NotFoundException('Client is not found');
    }

    client.firstname = firstname;
    client.adresse = adresse;
    client.birthday = birthday;
    client.lastname = lastname;
    client.telephone = telephone;
    client.lieuNaissance = lieuNaissance;
    client.cin = cin;
    client.villeCin = villeCin;
    client.villePermis = villePermis;
    client.datePermis = datePermis;
    await this.clientRepository.save(client);
    return client;
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
