import { Entity, ObjectId, Column, ObjectIdColumn } from 'typeorm';
import { Role } from '../classes/role';

@Entity()
export class PokemonTemplateSet {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    name: string;

    @Column()
    level: number;

    @Column()
    types: Array<string>;

    @Column()
    baseStats: Map<string, number>;

    @Column()
    sprite: string;

    @Column()
    roles: Array<Role>;
}