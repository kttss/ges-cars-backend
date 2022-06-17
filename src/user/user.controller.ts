import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user-dto';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: Number,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiCreatedResponse({
    description: 'List of users.',
    type: [UserDto],
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('load')
  loadData() {
    return this.userService.loadMockData();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Get user by ID',
  })
  @ApiCreatedResponse({
    description: 'get user',
    type: UserDto,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Update user by ID',
  })
  @ApiBody({
    description: 'user',
    type: UpdateUserDto,
  })
  @ApiCreatedResponse({
    description: 'get user',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'delete user by ID',
  })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
