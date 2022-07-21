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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleEnum } from '../user/enums/role.enum';
import { AgencyService } from './agency.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller('agency')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AgencyController {
  constructor(
    private readonly agencyService: AgencyService,
    private jwt: JwtService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The agencey has been successfully created.',
  })
  @ApiBody({
    description: 'agence',
    type: CreateAgencyDto,
  })
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agencyService.create(createAgencyDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.agencyService.findAll(req.headers.authorization);
  }

  @Get('load')
  loadData() {
    return this.agencyService.loadMockData();
  }

  @Get('logs')
  getLogs() {
    return this.agencyService.getAlllogs();
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
  update(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
    @Request() req,
  ) {
    return this.agencyService.update(
      +id,
      updateAgencyDto,
      req.headers.authorization,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'delete agence by ID',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.agencyService.remove(+id, req.headers.authorization);
  }
}
