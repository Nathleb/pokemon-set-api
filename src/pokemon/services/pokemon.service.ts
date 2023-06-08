import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { PokemonSet } from '../classes/pokemonSet';
import { Role } from '../classes/role';
import { GetRandomPokemonsParameterDto } from '../dtos/get-random-pokemons-parameter.dto';
import { KeyWord } from '../entities/keyWord.entity';
import { Move } from '../entities/move.entity';
import { PokemonTemplateSet } from '../entities/pokemonTemplateSet.entity';
import { KeyWordService } from './keyWord.service';
import { MoveService } from './move.service';

@Injectable()
export class PokemonService {

    constructor(@InjectRepository(PokemonTemplateSet) private pokemonTemplateSetsRepository: MongoRepository<PokemonTemplateSet>, private moveService: MoveService,
        private keyWordService: KeyWordService) { };

    public async findManyAtRandom(parameters: GetRandomPokemonsParameterDto): Promise<Array<PokemonSet>> {
        const size: number = parseInt(parameters.size, 10);
        const templates = await this.pokemonTemplateSetsRepository.aggregate([
            {
                $match: {}
            },
            { $sample: { size: size } },
        ]).toArray();

        let keyWordMap: Map<string, KeyWord> = new Map<string, KeyWord>();
        let moveMap: Map<string, Move> = new Map<string, Move>();

        let finalSets: Array<PokemonSet> = templates.map((template) => this.convertTemplateToSet(template, keyWordMap, moveMap));

        let detailedMoveList = this.moveService.findManyByName(Array.from(moveMap.keys()));
        let detailedkeyWordList = this.keyWordService.findManyByName(Array.from(keyWordMap.keys()));
        (await detailedkeyWordList).forEach(keyword => {
            keyWordMap.set(keyword.name, keyword);
        });
        (await detailedMoveList).forEach(move => {
            moveMap.set(move.name, move);
        });

        finalSets = this.addDescriptionToMovesAndKeyWords(finalSets, moveMap, keyWordMap);
        return finalSets;
    }

    private convertTemplateToSet(template: PokemonTemplateSet, keyWordMap: Map<string, KeyWord>, moveMap: Map<string, Move>): PokemonSet {
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
        pokemonSet.item = this.pickKeywordsAtRandomFromWeightedMap(items);
        pokemonSet.teraType = this.pickKeywordsAtRandomFromWeightedMap(teraTypes).name;
        pokemonSet.ability = this.pickKeywordsAtRandomFromWeightedMap(abilities);
        keyWordMap.set(pokemonSet.item.name, new KeyWord());
        keyWordMap.set(pokemonSet.ability.name, new KeyWord());

        pokemonSet.moves = this.pickMovesAtRandomFromWeightedMap(moves);
        pokemonSet.moves.forEach((move) => moveMap.set(move.name, new Move()));

        return pokemonSet;
    }

    private addDescriptionToMovesAndKeyWords(finalSets: Array<PokemonSet>, detailedMoveMap: Map<string, Move>, detailedkeyWordMap: Map<string, KeyWord>): Array<PokemonSet> {
        finalSets.forEach(set => {
            set.ability = detailedkeyWordMap.get(set.ability.name)!;
            set.item = detailedkeyWordMap.get(set.item.name)!;
            set.moves = set.moves.map(move => { return detailedMoveMap.get(move.name)!; });
        });
        return finalSets;
    }

    private pickKeywordsAtRandomFromWeightedMap(weightedMap: Map<string, number>): KeyWord {
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

    private pickMovesAtRandomFromWeightedMap(weightedMap: Map<string, number>): Array<Move> {
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

    private pickAtRandomRole(roles: Array<Role>) {
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

