import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RoleEnum } from './enums/role.enum';
import { users } from '../mock/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { firstname, lastname, password, email, telephone, role } =
      createUserDto;
    const alreadyExist = await this.findByEmail(email);

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    if (!alreadyExist) {
      const user: User = new User();
      user.firstname = firstname;
      user.lastname = lastname;
      user.email = email;
      user.password = passwordHash;
      user.telephone = telephone;
      user.role = role;

      const res = await this.usersRepository.save(user);
      return res.id;
    } else {
      return new BadRequestException('email already exist');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      // select: ['fullName', 'birthday'],
      where: [{ id: id }],
    });
  }

  async findByEmail(email: string) {
    console.log('email', email);
    return await this.usersRepository.findOne({
      where: [{ email: email }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User is not found');
    }
    await this.usersRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }

  async getUsersByIds(ids: number[]) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids: [...ids] })
      .getMany();
  }

  loadMockData() {
    const usersList = users;
    usersList.forEach((u: CreateUserDto) => {
      this.create(u);
    });
  }
}
