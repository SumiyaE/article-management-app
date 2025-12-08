import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './request-create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
