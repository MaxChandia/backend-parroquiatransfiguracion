import { Image } from "@prisma/client";

export class ImageEntity implements Image {
    id: number;
    s3Key: string;
    url: string;
    isCover: boolean;
    postId: number;
    createdAt: Date;
}