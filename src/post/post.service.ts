import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class PostService {

  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(PostService.name);

  async create(createPostDto: CreatePostDto) {
    if (!createPostDto.title || !createPostDto.content) {
      throw new BadRequestException('Título y cuerpo son requeridos');
    }

    const slug = createPostDto.title.toLocaleLowerCase().trim().replace(/ /g, '-');

    const newPost = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          slug,
          content: createPostDto.content,
          images: {
            create: createPostDto.images?.map(image => ({
              s3Key: image.s3Key,
              url: image.url,
              isCover: image.isCover,
            })) || []
          },
          authorId: createPostDto.authorId,
        }
      });
  
  this.logger.log(newPost)
  return newPost;
    
  }
  async findAll() {
    const posts = await this.prisma.post.findMany({
        include: {
          images: true,
        },
      });
      return posts;
  }

  async findOne(id: number) {
      const findPost = await this.prisma.post.findUnique({
        where: {
          id: id
        }
      })
      
      if (!findPost){
        console.log("No se pudo encontrar post")
        throw new NotFoundException(`No se pudo encontrar ${id} Post`)
      }
      this.logger.log(findPost)
      return findPost
  }

  async update(id: number, updatePostDto: UpdatePostDto) {

    const postActualizado = await this.prisma.post.update({
      where:{
        id:id},
      data: {
        title: updatePostDto.title,
        slug: updatePostDto.slug,
        content: updatePostDto.content,
        images: {
            create: updatePostDto.images?.map(image => ({
              s3Key: image.s3Key,
              url: image.url,
              isCover: image.isCover,
            })) || []
          },

      }
      })
    
    if(!postActualizado) {
      throw new NotFoundException('Post no encontrado')
    }

    this.logger.log(postActualizado)
    return postActualizado
  }

  async remove(id: number) {
    const removePost = await this.prisma.post.delete({
      where: { id: id}
    })

    if (!removePost) {
      throw new NotFoundException('Ppst no encontrado')
   
    }
    this.logger.log('Post eliminado correctamente')
    return `Post ${removePost.title} eliminado correctamente`;
  }
}
