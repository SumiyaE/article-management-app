import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ArticleContentDraftEntity } from './article-content-draft.entity';
import { ArticleContentPublishedEntity } from './article-content-published.entity';

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

  @OneToOne(() => ArticleContentDraftEntity, (contentDraft) => contentDraft.article, { cascade: true })
  contentDraft: ArticleContentDraftEntity;

  @OneToMany(() => ArticleContentPublishedEntity, (contentPublished) => contentPublished.article, { cascade: true })
  contentPublishedVersions: ArticleContentPublishedEntity[];
}
