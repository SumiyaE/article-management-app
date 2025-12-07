export class CreateArticleDto {
    title: string;
    content?: string;
    status: 'draft' | 'published';
    userId: number;
}
