import { Entity, ObjectID, Column, ObjectIdColumn } from 'typeorm';
import { Role } from '../classes/role';

@Entity()
export class PokemonTemplateSet {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    @Column()
    level: number;

    @Column()
    roles: Array<Role>;
}
