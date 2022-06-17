import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { Agency } from './entities/agency.entity';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(Agency) private agenceRepository: Repository<Agency>,
    private readonly userService: UserService,
  ) {}
  async create(createAgencyDto: CreateAgencyDto) {
    const { name, description, adresse, logo, users } = createAgencyDto;
    const agence: Agency = new Agency();
    agence.name = name;
    agence.description = description;
    agence.logo = logo;
    agence.adresse = adresse;

    const result = await this.userService.getUsersByIds(users);
    agence.users = [...result];

    const res = await this.agenceRepository.save(agence);
    return res.id;
  }

  findAll() {
    return `This action returns all agency`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agency`;
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    const { name, description, adresse, logo, users } = updateAgencyDto;

    const agence = await this.findById(id);

    if (!agence) {
      throw new NotFoundException('Agency is not found');
    }

    agence.name = name;
    agence.description = description;
    agence.logo = logo;
    agence.adresse = adresse;

    const result = await this.userService.getUsersByIds(users);
    agence.users = [...result];

    await this.agenceRepository.save(agence);
    return await this.findById(id);
  }

  remove(id: number) {
    return `This action removes a #${id} agency`;
  }

  async findById(id: number) {
    return await this.agenceRepository.findOne({
      where: [{ id: id }],
    });
  }
}
