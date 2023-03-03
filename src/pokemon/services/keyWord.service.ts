import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { KeyWord } from "../entities/keyWord.entity";

@Injectable()
export class MoveService {

    constructor(@InjectRepository(KeyWord) private keywordsRepository: MongoRepository<KeyWord>) { };

    async findManyByName(names: Array<string>) {
        return await this.keywordsRepository.aggregate([
            {
                $match: { name: { $in: names } }
            },
        ]).toArray();
    }
}