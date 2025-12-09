import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity('article_content_published')
export class ArticleContentPublishedEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'published_at' })
  publishedAt: Date;

  @ManyToOne(() => ArticleEntity, (article) => article.contentPublishedVersions)
  @JoinColumn({ name: 'article_id' })
  article: ArticleEntity;
}
