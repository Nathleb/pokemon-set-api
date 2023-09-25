import { Entity, Column, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Move {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    name: string;
    @Column()
    description: string;
    @Column()
    pp: number;
    @Column()
    damage: number;
    @Column()
    accuracy: number | boolean;
    @Column()
    type: string;
    @Column()
    category: string;
}
