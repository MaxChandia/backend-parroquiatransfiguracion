import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    
    if (!createUserDto.name || !createUserDto.email || !createUserDto.password) {
      throw new BadRequestException('Name, email and password are required');
    }

    try { 
      const newUser = await this.prisma.user.create({
        data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password
      }
    })
    return newUser;

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Usuario ya existe');
      }

      throw new InternalServerErrorException('Un error con el servidor ha ocurrido');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Un error con el servidor ha ocurrido');
    }
  }

  async findOne(email: string) {
    try {
      const userFound = await this.prisma.user.findUnique({
        where: { email: email }
      })
      if (!userFound) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado`);
      }
      return userFound;
    } catch (error) {
      throw new InternalServerErrorException('Un error con el servidor ha ocurrido');
    }
      
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try{
    const patchUser = await this.prisma.user.update({
      where: { id: id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password
      }
    })
    return patchUser;
    } catch (error) {      
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      throw new InternalServerErrorException('Un error con el servidor ha ocurrido');
    }
  }

  async remove(id: number) {
    try{
      const deleteUser = await this.prisma.user.delete({
        where: { id: id }
      });
      return deleteUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      throw new InternalServerErrorException('Un error con el servidor ha ocurrido');
    }
  }
}
