import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common'; // Ajusta esto si lanzas otro error

// 1. Secuestramos bcrypt y le damos un molde para la función 'compare'
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  // Simulador de Prisma
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  // Simulador del generador de Tokens JWT
  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('Debería retornar un token si las credenciales son válidas', async () => {
      // 1. Arrange
      const loginDto = { email: 'max@correo.com', password: 'MiClaveSecreta' };
      const usuarioEnDB = {
        id: 1,
        email: 'max@correo.com',
        password: 'hash_guardado_en_db',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(usuarioEnDB);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Simulamos que la clave coincide
      (jwtService.sign as jest.Mock).mockReturnValue('token_jwt_falso_y_seguro');

      // 2. Act
      const resultado = await service.login(loginDto);

      // 3. Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith('MiClaveSecreta', 'hash_guardado_en_db');
      expect(jwtService.sign).toHaveBeenCalled();
      
      // Verificamos que devuelva el objeto con el token
      expect(resultado).toEqual({ access_token: 'token_jwt_falso_y_seguro' });
    });

    it('Debería lanzar un error si la contraseña es incorrecta', async () => {
      // 1. Arrange
      const loginDto = { email: 'max@correo.com', password: 'ClaveEquivocada' };
      const usuarioEnDB = {
        id: 1,
        email: 'max@correo.com',
        password: 'hash_guardado_en_db',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(usuarioEnDB);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simulamos que la clave NO coincide

      // 2 & 3. Act & Assert
      // Cuando probamos errores (excepciones), usamos rejects.toThrow()
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});