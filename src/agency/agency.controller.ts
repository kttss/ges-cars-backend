import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller('agency')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The agencey has been successfully created.',
  })
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agencyService.create(createAgencyDto);
  }

  @Get()
  findAll() {
    return this.agencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agencyService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Update user by ID',
  })
  @ApiBody({
    description: 'user',
    type: UpdateAgencyDto,
  })
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agencyService.update(+id, updateAgencyDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'delete agence by ID',
  })
  remove(@Param('id') id: string) {
    return this.agencyService.remove(+id);
  }
}
