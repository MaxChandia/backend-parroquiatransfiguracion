import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AwsService } from 'src/aws/aws.service';
import { BadRequestException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  let prisma: PrismaService;
  let awsService: AwsService; 

  const mockPrismaService = {
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    image: {
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    }
  };

  const mockAwsService = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AwsService, useValue: mockAwsService },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prisma = module.get<PrismaService>(PrismaService);
    awsService = module.get<AwsService>(AwsService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });


  describe('create', () => {
    it('Debería crear un post con una imagen subida a AWS', async () => {
      const createPostDto = {
        title: 'Misa de Domingo',
        slug: 'misa-de-domingo',
        images: [],
        content: 'Contenido de la misa',
        authorId: 1,
      } as any;

      const mockFile = {
        originalname: 'foto.jpg',
        buffer: Buffer.from('archivo falso'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const awsResponse = {
        url: 'https://mi-bucket.s3.amazonaws.com/imagenes/foto.jpg',
        s3Key: 'imagenes/foto.jpg',
      };
      (awsService.uploadFile as jest.Mock).mockResolvedValue(awsResponse);

      const postGuardado = {
        id: 1,
        title: 'Misa de Domingo',
        slug: 'misa-de-domingo',
        content: 'Contenido de la misa',
        authorId: 1,
      };
      (prisma.post.create as jest.Mock).mockResolvedValue(postGuardado);

      const result = await service.create(createPostDto, mockFile);

    
      expect(awsService.uploadFile).toHaveBeenCalledWith(mockFile);

      expect(prisma.post.create).toHaveBeenCalledWith({
        data: {
          title: createPostDto.title,
          slug: 'misa-de-domingo',
          content: createPostDto.content,
          authorId: 1,
          images: {
            create: [
              {
                s3Key: awsResponse.s3Key,
                url: awsResponse.url,
                isCover: true,
              },
            ],
          },
        },
      });
      
      expect(result).toEqual(postGuardado);
    });
  });

  describe('findAll', () => {
    it('Debería retornar un arreglo de publicaciones', async () => {

      const postsFalsos = [
        { id: 1, title: 'Misa 1' },
        { id: 2, title: 'Misa 2' },
      ];
      (prisma.post.findMany as jest.Mock).mockResolvedValue(postsFalsos);


      const resultado = await service.findAll();


      expect(resultado).toEqual(postsFalsos);
      expect(prisma.post.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('Debería retornar una publicación específica por su ID', async () => {

      const idPost = 1;
      const postFalso = { id: idPost, title: 'Misa Especial' };
      (prisma.post.findUnique as jest.Mock).mockResolvedValue(postFalso);


      const resultado = await service.findOne(idPost);


      expect(resultado).toEqual(postFalso);
      
   
      expect(prisma.post.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: idPost } })
      );
    });
  });

  describe('update', () => {
    it('Debería actualizar una publicación', async () => {

      const idPost = 1;
      const dtoActualizar = { title: 'Título Corregido' } as any;
      const postActualizado = { id: idPost, title: 'Título Corregido' };
      
    
      (prisma.post.update as jest.Mock).mockResolvedValue(postActualizado);


      const resultado = await service.update(idPost, dtoActualizar);


      expect(resultado).toEqual(postActualizado);
      expect(prisma.post.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: idPost }
        })
      );
    });
  });

  describe('remove', () => {
    it('Debería eliminar una publicación', async () => {

      const idPost = 1;
      const postEliminado = { id: idPost, title: 'Misa Eliminada' };
      

      (prisma.post.delete as jest.Mock).mockResolvedValue(postEliminado);


      const resultado = await service.remove(idPost);


      expect(resultado).toEqual('Post Misa Eliminada eliminado correctamente');
      expect(prisma.post.delete).toHaveBeenCalledWith({
        where: { id: idPost },
      });
    });
  });
});