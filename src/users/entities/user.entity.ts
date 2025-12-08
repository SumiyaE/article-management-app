import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ArticleEntity } from '../../articles/entities/article.entity';
import { OrganizationEntity } from '../../organizations/entities/organization.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'thumbnail_image', type: 'varchar', length: 255, nullable: true })
  thumbnailImage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles: ArticleEntity[];

  @ManyToOne(() => OrganizationEntity, (organization) => organization.users)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;
}
