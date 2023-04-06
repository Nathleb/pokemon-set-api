import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Move {

    @ObjectIdColumn()
    id: ObjectID;

    @Column({ unique: true })
    name: string;
    @Column()
    description: string;
    @Column()
    pp: number;
    @Column()
    damage: number;
    @Column()
    accuracy: number;
    @Column()
    type: string;
}
