import { PartialType } from '@nestjs/swagger';
import { RequestCreateArticleDto } from './request-create-article.dto';

export class RequestUpdateArticleDto extends PartialType(RequestCreateArticleDto) {}
