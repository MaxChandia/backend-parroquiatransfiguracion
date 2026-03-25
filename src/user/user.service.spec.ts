import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

 jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
    })
  );

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

 

  const mockPrismaService = {
    user:{
      findUnique: jest.fn(),
      create: jest.fn(),
    }

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne/findUnique', ( ) =>{
    it('Debería retornar un usuario si existe el correo', async () => {

      const falseUser = {
        id:1,
        email:'max@correo.com',
        password:'hashedpassword',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(falseUser);

      const result = await service.findOne('max@correo');

      expect(result).toEqual(falseUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'max@correo' },
      });
    })

  });

  describe('create', () => {
    it('Debería crear un nuevo usuario', async () => {
      const createUserDto = {
        name: 'Max',
        email: 'nuevo@correo.cl',
        password: 'password123',
      };

      const usuarioGuardado = {
        id: 2,
        email: 'nuevo@correo.cl',
        password: 'password123', 
      };


      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      (prisma.user.create as jest.Mock).mockResolvedValue(usuarioGuardado);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hash_falso_generado_por_bcrypt');

      const resultado = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Max',
          email: 'nuevo@correo.cl',
          password: 'hash_falso_generado_por_bcrypt',
        },
      });
      expect(resultado).toEqual(usuarioGuardado);

    });
  });

});
