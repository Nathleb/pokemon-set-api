import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class KeyWord {

    @ObjectIdColumn()
    id: ObjectID;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    type: "ability" | "item";
}
