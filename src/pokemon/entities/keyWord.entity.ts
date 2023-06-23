import { Entity, Column, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class KeyWord {

    @ObjectIdColumn()
    id: ObjectId;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @Column()
    type: "ability" | "item";
}
