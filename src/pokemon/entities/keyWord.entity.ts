import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class KeyWord {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    type: "ability" | "move" | "item";
}
