import { Post } from "@prisma/client";
import { ImageEntity } from "./image.entity";

export class PostEntity implements Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    images: [ImageEntity];
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
}
