import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { PokemonSet } from '../classes/pokemonSet';
import { Role } from '../classes/role';
import { GetRandomPokemonsParameterDto } from '../dtos/get-random-pokemons-parameter.dto';
import { KeyWord } from '../entities/keyWord.entity';
import { Move } from '../entities/move.entity';
import { PokemonTemplateSet } from '../entities/pokemonTemplateSet.entity';

@Injectable()
export class PokemonService {

    constructor(@InjectRepository(PokemonTemplateSet) private pokemonTemplateSetsRepository: MongoRepository<PokemonTemplateSet>) { };

    async findManyAtRandom(parameters: GetRandomPokemonsParameterDto) {
        const { size } = parameters;
        const templates = await this.pokemonTemplateSetsRepository.aggregate([
            {
                $match: {}
            },
            { $sample: { size: size } },
        ]).toArray();
        return templates.map((template) => this.convertTemplateToSet(template));
    }

    convertTemplateToSet(template: PokemonTemplateSet): PokemonSet {
        let pokemonSet: PokemonSet = new PokemonSet();
        const { name, level, roles, baseStats, sprite, types } = template;

        let randomRole = this.pickAtRandomRole(roles);
        let { ivs, evs, moves, teraTypes, items, abilities } = randomRole;

        items = items ? new Map<string, number>(Object.entries(items)) : new Map<string, number>();
        teraTypes = teraTypes ? new Map<string, number>(Object.entries(teraTypes)) : new Map<string, number>();
        moves = moves ? new Map<string, number>(Object.entries(moves)) : new Map<string, number>();
        abilities = abilities ? new Map<string, number>(Object.entries(abilities)) : new Map<string, number>();

        pokemonSet.name = name;
        pokemonSet.level = level;
        pokemonSet.role = randomRole.name;
        pokemonSet.ivs = ivs;
        pokemonSet.evs = evs;
        pokemonSet.baseStats = baseStats;
        pokemonSet.types = types;
        pokemonSet.sprite = sprite;
        pokemonSet.item = this.pickAtRandomFromWeightedMap(items);
        pokemonSet.teraType = this.pickAtRandomFromWeightedMap(teraTypes).name;
        pokemonSet.ability = this.pickAtRandomFromWeightedMap(abilities);

        pokemonSet.moves = this.pickMovesAtRandomFromWeightedMap(moves);

        return pokemonSet;
    }

    pickAtRandomFromWeightedMap(weightedMap: Map<string, number>): KeyWord {
        let totalWeight = 0;
        for (let [key, weight] of weightedMap) {
            if (weight == 1) {
                let keyword = new KeyWord();
                keyword.name = key;
                return keyword;
            }
            totalWeight += weight;
        };

        let remainingWeight = Math.random() * totalWeight;

        for (let [key, weight] of weightedMap) {
            if (remainingWeight < weight) {
                let keyword = new KeyWord();
                keyword.name = key;
                return keyword;
            }
            remainingWeight -= weight;
        }
        return new KeyWord();
    }

    pickMovesAtRandomFromWeightedMap(weightedMap: Map<string, number>): Array<Move> {
        let pickedValues: Array<Move> = new Array<Move>();
        let remainingPicks = 0;
        for (let [key, weight] of weightedMap) {
            if (weight == 1) {
                let move = new Move();
                move.name = key;
                pickedValues.push(move);
                weightedMap.delete(key);
            }
            else remainingPicks += weight;
        };

        remainingPicks = Math.round(remainingPicks);
        let remainingWeight = Math.random() * remainingPicks;

        while (remainingPicks > 0) {
            for (let [key, weight] of weightedMap) {
                if (remainingPicks > 0 && remainingWeight < weight) {
                    let move = new Move();
                    move.name = key;
                    pickedValues.push(move);
                    weightedMap.delete(key);
                    remainingPicks--;
                }
                remainingWeight -= weight;
            };
        }

        return pickedValues;
    }

    pickAtRandomRole(roles: Array<Role>) {
        let remainingWeight = Math.random();

        for (let role of roles) {
            if (remainingWeight < role.weight) {
                return role;
            }
            remainingWeight -= role.weight;
        }
        return roles[0];
    }

}

