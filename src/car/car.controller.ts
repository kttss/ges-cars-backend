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
  Query,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('car')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiTags('cars')
@ApiBearerAuth()
export class CarController {
  constructor(
    private readonly carService: CarService,
    private jwt: JwtService,
  ) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto, @Request() req: any) {
    return this.carService.create(createCarDto, req.headers.authorization);
  }

  @Get()
  @ApiQuery({ name: 'dateDebut', required: false })
  @ApiQuery({ name: 'dateFin', required: false })
  findAll(
    @Request() req: any,
    @Query('dateDebut') dateDebut?: string,
    @Query('dateFin') dateFin?: string,
  ) {
    let dateDebutParsed: Date | undefined;
    let dateFinParsed: Date | undefined;

    if (dateDebut) {
      dateDebutParsed = new Date(dateDebut);
    }
    if (dateFin) {
      dateFinParsed = new Date(dateFin);
    }
    return this.carService.findAll(
      req.headers.authorization,
      dateDebutParsed,
      dateFinParsed,
    );
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
  update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Request() req: any,
  ) {
    return this.carService.update(+id, updateCarDto, req.headers.authorization);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.carService.remove(+id, req.headers.authorization);
  }
}
