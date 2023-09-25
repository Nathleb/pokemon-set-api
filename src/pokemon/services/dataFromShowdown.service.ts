import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository } from "typeorm";
import { KeyWord } from "../entities/keyWord.entity";
import { Move } from "../entities/move.entity";
import { PokemonTemplateSet } from "../entities/pokemonTemplateSet.entity";

import { BattleItems } from "dataFromShowdown/items";
import { BattleAbilities } from "dataFromShowdown/abilities";
import { readFile } from "fs";

@Injectable()
export class DataFromSdService {

    constructor(@InjectRepository(PokemonTemplateSet) private pokemonTemplateSetsRepository: MongoRepository<PokemonTemplateSet>,
        @InjectRepository(KeyWord) private keyWordRepository: MongoRepository<KeyWord>,
        @InjectRepository(Move) private moveRepository: MongoRepository<Move>) { };


    addMovesToDb() {
        this.moveRepository.clear();
        readFile('dataFromShowdown/moves.json', 'utf8', (async (err, content) => {
            const moves = JSON.parse(content);

            Object.values(moves).forEach((mv: any) => {
                let move = new Move();

                move.name = mv.name;
                move.accuracy = mv.accuracy;
                move.damage = mv.basePower;
                move.category = mv.category;
                move.description = mv.shortDesc;
                move.pp = mv.pp;
                move.type = mv.type.toLowerCase();

                move = this.moveRepository.create(move);
                this.moveRepository.save(move);
            });
        }));
    }

    async addKeyWordsToDb() {

        this.keyWordRepository.clear();

        Object.values(BattleAbilities).forEach(async ab => {
            let ability = new KeyWord();
            ability.name = ab.name;
            ability.description = ab.shortDesc;
            ability.type = "ability";
            ability = this.keyWordRepository.create(ability);
            try {
                await this.keyWordRepository.save(ability);
            } catch (error) {
                if (error.name === 'BulkWriteError') {
                    throw error;
                }
            }
        });

        Object.values(BattleItems).forEach(async it => {
            let item = new KeyWord();
            item.name = it.name;
            item.description = it.desc || "";
            item.type = "item";
            item = this.keyWordRepository.create(item);
            try {
                await this.keyWordRepository.save(item);
            } catch (error) {
                if (error.name === 'BulkWriteError') {
                    throw error;
                }
            }
        });
    }
}