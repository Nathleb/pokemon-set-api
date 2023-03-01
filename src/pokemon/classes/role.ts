import { Column } from "typeorm";

export class Role {

    @Column()
    name: string;
    @Column()
    weight: number;
    @Column()
    items: Map<string, number>;
    @Column()
    abilities: Map<string, number>;
    @Column()
    teraTypes: Map<string, number>;
    @Column()
    moves: Map<string, number>;
    @Column()
    evs: Map<string, number>;
    @Column()
    ivs: Map<string, number>;

}