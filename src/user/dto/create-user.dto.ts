import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

    
export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    email: string

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty({ required: false })
    @IsArray()
    Posts?: [];
}
