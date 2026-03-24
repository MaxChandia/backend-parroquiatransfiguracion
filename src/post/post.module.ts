import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [PostController],
  providers: [PostService, AwsService],
})
export class PostModule {}
