import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AGENCES } from '../mock/agence';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Agency } from './entities/agency.entity';
import { Email } from './entities/email.entity';
import { Fax } from './entities/fax.entity';
import { Telephone } from './entities/telephone..entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency) private agenceRepository: Repository<Agency>,
    @InjectRepository(Email) private emailRepository: Repository<Email>,
    @InjectRepository(Telephone)
    private telphoneRepository: Repository<Telephone>,
    @InjectRepository(Fax) private faxRepository: Repository<Fax>,
    private readonly userService: UserService,
  ) {}
  async create(createAgencyDto: CreateAgencyDto) {
    const {
      name,
      description,
      adresse,
      logo,
      users,
      emails,
      telephones,
      faxs,
    } = createAgencyDto;
    const agence: Agency = new Agency();
    agence.name = name;
    agence.description = description;
    agence.logo = logo;
    agence.adresse = adresse;

    const result = await this.userService.getUsersByIds(users);
    agence.users = [...result];

    const res = await this.agenceRepository.save(agence);

    emails.forEach((row) => {
      const email = new Email();
      email.value = row;
      email.agence = res;
      this.emailRepository.save(email);
    });

    telephones.forEach((row) => {
      const tel = new Telephone();
      tel.value = row;
      tel.agence = res;
      this.telphoneRepository.save(tel);
    });

    faxs.forEach((row) => {
      const fax = new Telephone();
      fax.value = row;
      fax.agence = res;
      this.faxRepository.save(fax);
    });

    return res.id;
  }

  async findAll() {
    const agences = await this.agenceRepository
      .createQueryBuilder('agency')
      .leftJoinAndSelect('agency.users', 'user')
      .leftJoinAndSelect('agency.emails', 'email')
      .leftJoinAndSelect('agency.telephones', 'telephone')
      .leftJoinAndSelect('agency.faxs', 'fax')
      .getMany();

    // return await this.agenceRepository.find({
    //   relations: ['users', 'emails'],
    // });

    return agences;
  }

  async findOne(id: number) {
    return await this.agenceRepository
      .createQueryBuilder('agency')
      .leftJoinAndSelect('agency.users', 'user')
      .leftJoinAndSelect('agency.emails', 'email')
      .leftJoinAndSelect('agency.telephones', 'telephone')
      .leftJoinAndSelect('agency.faxs', 'fax')
      .where({ id: id })
      .getOne();
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    const {
      name,
      description,
      adresse,
      logo,
      users,
      emails,
      telephones,
      faxs,
    } = updateAgencyDto;

    const agence = await this.findById(id);

    if (!agence) {
      throw new NotFoundException('Agency is not found');
    }

    agence.name = name;
    agence.description = description;
    agence.logo = logo;
    agence.adresse = adresse;
    this.emailRepository
      .createQueryBuilder()
      .delete()
      .from(Email)
      .where('email.agenceId = :id', { id: id })
      .execute();

    emails.forEach((row) => {
      const email = new Email();
      email.value = row;
      email.agence = agence;
      this.emailRepository.save(email);
    });

    this.telphoneRepository
      .createQueryBuilder()
      .delete()
      .from(Telephone)
      .where('telephone.agenceId = :id', { id: id })
      .execute();

    telephones.forEach((row) => {
      const tel = new Telephone();
      tel.value = row;
      tel.agence = agence;
      this.telphoneRepository.save(tel);
    });

    this.faxRepository
      .createQueryBuilder()
      .delete()
      .from(Fax)
      .where('fax.agenceId = :id', { id: id })
      .execute();

    faxs.forEach((row) => {
      const fax = new Telephone();
      fax.value = row;
      fax.agence = agence;
      this.faxRepository.save(fax);
    });

    const result = await this.userService.getUsersByIds(users);
    agence.users = [...result];

    await this.agenceRepository.save(agence);
    return await this.findById(id);
  }

  async remove(id: number) {
    return await this.agenceRepository.delete(id);
  }

  async findById(id: number) {
    return await this.agenceRepository.findOne({
      where: [{ id: id }],
    });
  }

  loadMockData() {
    const agenceList = AGENCES;
    agenceList.forEach((a: CreateAgencyDto) => {
      this.create(a);
    });
  }
}
