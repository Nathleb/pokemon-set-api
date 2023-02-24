import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TemplateSet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    level: number;

    @Column()
    items: any;

    @Column()
    abilities: any;

    @Column()
    roles: any;
}
