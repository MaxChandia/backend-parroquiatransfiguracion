import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AwsService {
    
    private readonly s3Client: S3Client
    
    constructor(){
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION as string,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            },
        });
    }

    async uploadFile(file: Express.Multer.File) {
    try {
   
      const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const key = `imagenes/${uniqueFileName}`; 

    
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype, 
      });

      
      await this.s3Client.send(command);


      return {
        url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        s3Key: key,
      };

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al subir la imagen a los servidores de AWS');
    }
  }

  async deleteFile(s3Key: string) {
    try {
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Fallo en S3 al borrar ${s3Key}:`, error);
      throw new Error(`No se pudo eliminar de S3: ${s3Key}`);
    }
  }

}
