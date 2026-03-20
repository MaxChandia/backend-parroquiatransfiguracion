import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({summary: "Crear Post"})
  @ApiResponse({ status: 201, description: 'Post creado exitosamente.' })
  @ApiResponse({status: 400, description: 'No se pudo crear post'})
  @ApiResponse({status: 409, description: 'Título de post ya creado'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({summary: "Traer Posts"})
  @ApiResponse({status: 200, description: 'Posts encontrados'})
  @ApiResponse({status: 400, description: 'No se pudo encontrar posts'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: "Traer Post por id"})
  @ApiResponse({status: 200, description: 'Post encontrado'})
  @ApiResponse({status: 404, description: 'No se pudo encontrar posts'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: "Actualizar Post por id"})
  @ApiResponse({status: 200, description: 'Post actualizado'})
  @ApiResponse({status: 404, description: 'No se pudo encontrar posts'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({summary: "Borrar Post por id"})
  @ApiResponse({status: 200, description: 'Post eliminado'})
  @ApiResponse({status: 404, description: 'No se pudo encontrar posts'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
