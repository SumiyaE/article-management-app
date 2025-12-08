import { PartialType } from '@nestjs/mapped-types';
import { RequestCreateArticleDto } from './request-create-article.dto';

export class RequestUpdateArticleDto extends PartialType(RequestCreateArticleDto) {}
