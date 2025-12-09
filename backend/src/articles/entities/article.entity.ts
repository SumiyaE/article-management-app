import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ArticleContentEntity } from './article-content.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => ArticleContentEntity, (articleContent) => articleContent.article, { cascade: true })
  articleContent: ArticleContentEntity;
}
