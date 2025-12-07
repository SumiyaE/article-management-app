import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'text' })
    content: string = '';
}
