import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PostService {

  constructor(private readonly prisma: PrismaService, private readonly awsService: AwsService) {}
  private readonly logger = new Logger(PostService.name);

  async create(createPostDto: CreatePostDto, file?: Express.Multer.File) {
    if (!createPostDto.title || !createPostDto.content) {
      throw new BadRequestException('Título y cuerpo son requeridos');
    }

    const slug = createPostDto.title.toLocaleLowerCase().trim().replace(/ /g, '-');

    const uploadedImage = file ? await this.awsService.uploadFile(file) : null;

    const newPost = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          slug,
          content: createPostDto.content,
          authorId: Number(createPostDto.authorId),
          images: {
            create: uploadedImage ? [{
              s3Key: uploadedImage.s3Key,
              url: uploadedImage.url,
              isCover: true,
            }] : []
          }
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
          
        },
        include: {
          images: true,
        },
      })
      
      if (!findPost){
        console.log("No se pudo encontrar post")
        throw new NotFoundException(`No se pudo encontrar ${id} Post`)
      }
      this.logger.log(findPost)
      return findPost
  }

  async findBySlug(slug: string) {
    const findPost = await this.prisma.post.findUnique({
      where: {
        slug: slug
      },
      include: {images: true}
    })
    
    if (!findPost){
      console.log("No se pudo encontrar post")
      throw new NotFoundException(`No se pudo encontrar ${slug} Post`)
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

    const postToDelete = await this.prisma.post.findUnique({
      where: { id: id },
      include: { images: true },
    });

    if (!postToDelete) {
      throw new NotFoundException('Post no encontrado');
    }

    if (postToDelete.images && postToDelete.images.length > 0) {
      for (const image of postToDelete.images) {
        try {
          await this.awsService.deleteFile(image.s3Key);
        } catch (error) {
          this.logger.error(`Error al eliminar imagen ${image.s3Key} de S3: ${error.message}`);
        }
      }
    }

    await this.prisma.image.deleteMany({
      where: { postId: id },
    });
    const removePost = await this.prisma.post.delete({
      where: { id: id}
    })

    this.logger.log('Post eliminado correctamente')
    return `Post ${removePost.title} eliminado correctamente`;
  }
}
