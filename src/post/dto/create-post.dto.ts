import { ApiProperty } from "@nestjs/swagger";
import { ImageEntity } from "../entities/image.entity";
import { IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    slug: string

    @ApiProperty()
    @IsString()
    content: string;
    
    @ApiProperty({ required: false })
    @IsString({ each: true })
    images: [ImageEntity];

    @ApiProperty()
    @IsString()
    authorId: number;

    @ApiProperty({ type: 'string', format: 'binary', description: 'Imagen de portada', required: false })
    file?: any;

}
