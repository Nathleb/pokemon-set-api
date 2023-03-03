import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { Move } from "../entities/move.entity";

@Injectable()
export class MoveService {

    constructor(@InjectRepository(Move) private movesRepository: MongoRepository<Move>) { };

    async findManyByName(names: Array<string>) {
        return await this.movesRepository.aggregate([
            {
                $match: { name: { $in: names } }
            },
        ]).toArray();
    }
}