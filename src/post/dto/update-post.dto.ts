import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { ImageEntity } from '../entities/image.entity';
import { IsString } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {

    @ApiProperty({ required: false })
    @IsString()
    title?: string | undefined;

    @ApiProperty({ required: false })
    @IsString()
    slug?: string | undefined;

    @ApiProperty({ required: false })
    @IsString()
    content?: string | undefined;

    @ApiProperty({ required: false })
    @IsString({ each: true })
    images?: [ImageEntity];
}
