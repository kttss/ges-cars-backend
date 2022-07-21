import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContratService } from './contrat.service';
import { CreateContratDto } from './dto/create-contrat.dto';
import { UpdateContratDto } from './dto/update-contrat.dto';

@Controller('contrat')
@ApiTags('Contrat')
export class ContratController {
  constructor(private readonly contratService: ContratService) {}

  @Post()
  create(@Body() createContratDto: CreateContratDto) {
    return this.contratService.create(createContratDto);
  }

  @Get()
  findAll() {
    return this.contratService.findAll();
  }

  @Get('pdf')
  generatePdf() {
    this.contratService.generateContrat();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContratDto: UpdateContratDto) {
    return this.contratService.update(+id, updateContratDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contratService.remove(+id);
  }
}
