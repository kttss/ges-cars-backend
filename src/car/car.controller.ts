import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleEnum } from '../user/enums/role.enum';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('car')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiTags('cars')
export class CarController {
  constructor(
    private readonly carService: CarService,
    private jwt: JwtService,
  ) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  findAll(@Request() req) {
    const header: any = req.headers;
    const jwtDecoded: any = this.jwt.decode(header.authorization.split(' ')[1]);
    if (jwtDecoded.role === RoleEnum.Admin) {
      return this.carService.findAll();
    } else {
      return this.carService.findAllByAdmin(jwtDecoded.id);
    }

    return this.carService.findAll();
  }

  @Get('load')
  loadData() {
    return this.carService.loadMockData();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
