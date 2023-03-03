import { Entity, PrimaryGeneratedColumn, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Move {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    pp: string;
    @Column()
    damage: string;
    @Column()
    type: string;
}
