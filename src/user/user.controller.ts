import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({status: 400, description: 'Solicitud incorrecta.'})
  @ApiResponse({status: 500, description: 'No se pudo conectar con el servidor'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({summary: 'Buscar usuarios'})
  @ApiResponse({status: 200, description: 'Usuarios encontrados'})
  @ApiResponse({status: 500, description: 'No se pudo conectar con el servidor'})
  findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  @ApiOperation({summary: 'Encontrar un usuario por email'})
  @ApiParam({name: 'Email', description: 'Correo único de usuario'})
  @ApiResponse({status: 200, description:'Usuario encontrado'})
  @ApiResponse({status: 404, description: 'Usuario no encontrado'})
  findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Actualizar un usuario por email'})
  @ApiParam({name: 'id', description: 'ID de usuario'})
  @ApiResponse({status: 200, description:'Usuario actualizado'})
  @ApiResponse({status: 404, description: 'Usuario no encontrado'})
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Eliminar un usuario por email'})
  @ApiParam({name: 'id', description: 'ID de usuario'})
  @ApiResponse({status: 200, description:'Usuario eliminado'})
  @ApiResponse({status: 404, description: 'Usuario no encontrado'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
