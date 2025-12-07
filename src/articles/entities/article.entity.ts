import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'text' })
    content: string = '';

    @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
    status: 'draft' | 'published';

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.articles)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
