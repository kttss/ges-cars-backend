import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Agency } from './entities/agency.entity';
import { Email } from './entities/email.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency) private agenceRepository: Repository<Agency>,
    @InjectRepository(Email) private emailRepository: Repository<Email>,
    private readonly userService: UserService,
  ) {}
  async create(createAgencyDto: CreateAgencyDto) {
    const { name, description, adresse, logo, users, emails } = createAgencyDto;
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
      email.email = row;
      email.agence = res;
      this.emailRepository.save(email);
    });

    return res.id;
  }

  async findAll() {
    const agences = await this.agenceRepository
      .createQueryBuilder('agency')
      .leftJoinAndSelect('agency.users', 'user')
      .getMany();

    return agences;
  }

  findOne(id: number) {
    return `This action returns a #${id} agency`;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    const { name, description, adresse, logo, users, emails } = updateAgencyDto;

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
      email.email = row;
      email.agence = agence;
      this.emailRepository.save(email);
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
}
