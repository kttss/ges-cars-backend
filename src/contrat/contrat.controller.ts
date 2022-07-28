import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
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
  findAll(@Request() req: any) {
    return this.contratService.findAll(req.headers.authorization);
  }

  @Get('pdf')
  generatePdf() {
    this.contratService.generateContrat();
  }

  @Get('statistique')
  getstatistique(@Request() req: any) {
    return this.contratService.getstatistique(req.headers.authorization);
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
