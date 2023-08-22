import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiBody({
    description: 'client',
    type: CreateClientDto,
  })
  create(@Body() createClientDto: CreateClientDto, @Request() req) {
    return this.clientService.create(
      createClientDto,
      req.headers.authorization,
    );
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get('paginate')
  findAllByPaginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('count', new DefaultValuePipe(1), ParseIntPipe) count: number,
    @Query('search') search: string,
    @Query('orderBy') orderBy: string,
    @Query('order') order: 'ASC' | 'DESC',
  ) {
    return this.clientService.findByPaginate(
      page,
      count,
      search,
      orderBy,
      order,
    );
  }

  @Get('load')
  loadData() {
    return this.clientService.loadMockData();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Get('doc/:id')
  findDocument(@Param('id') id: string) {
    return this.clientService.findDocByID(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req,
  ) {
    return this.clientService.update(
      +id,
      updateClientDto,
      req.headers.authorization,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.clientService.remove(+id, req.headers.authorization);
  }
}
