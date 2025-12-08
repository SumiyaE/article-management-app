export class RequestCreateArticleDto {
    title: string;
    content?: string;
    status: 'draft' | 'published';
    userId: number;
}
