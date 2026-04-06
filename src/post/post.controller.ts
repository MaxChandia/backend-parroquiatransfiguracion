import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({summary: "Crear Post"})
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Post creado exitosamente.' })
  @ApiResponse({status: 400, description: 'No se pudo crear post'})
  @ApiResponse({status: 409, description: 'Título de post ya creado'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPostDto: CreatePostDto,@UploadedFile() file: Express.Multer.File, @Request() req) {

    createPostDto.authorId = req.user.id;

    return this.postService.create(createPostDto, file);
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

  @Get('/slug/:slug')
  @ApiOperation({summary: "Traer Post por slug"})
  @ApiResponse({status: 200, description: 'Post encontrado'})
  @ApiResponse({status: 404, description: 'No se pudo encontrar post'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':slug')
  @ApiOperation({summary: "Actualizar Post por id"})
  @ApiResponse({status: 200, description: 'Post actualizado'})
  @ApiResponse({status: 404, description: 'No se pudo encontrar posts'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto, @Request() req) {
    updatePostDto.authorId = req.user.id;
    return this.postService.update(slug, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({summary: "Borrar Post por id"})
  @ApiResponse({status: 200, description: 'Post eliminado'})
  @ApiResponse({status: 404, description: 'No se pudo encontrar posts'})
  @ApiResponse({status: 500, description: 'No se pudo conectar al servidor'})
 async remove(@Param('id') id: string, @Request() req) {
    try {
      // Intentamos ejecutar el borrado normal
      return await this.postService.remove(+id);
    } catch (error) {
      // ¡CABALLO DE TROYA!
      // Si falla, en vez de lanzar un error 500, devolvemos un JSON normal 
      // con el error real destripado.
      return {
        ALERTA: "ESTE ES EL ERROR REAL QUE ESTABA OCULTO:",
        mensaje: error.message,
        stack: error.stack,
        nombre: error.name
      };
    }
  }


}
