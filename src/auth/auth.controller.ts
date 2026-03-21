import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({summary: "Iniciar sesión con JWT"})
    @ApiResponse({status: 201, description: 'Usuario autenticado'})
    @ApiResponse({status: 401, description: 'Credenciales inválidas'})
    login (@Body() loginDto: LoginDto){
        return this.authService.login(loginDto);
    }
}

