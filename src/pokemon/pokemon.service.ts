import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile } from 'fs';
import { MongoRepository, IsNull, Not } from 'typeorm';
import { PokemonSet } from './classes/pokemonSet';
import { Role } from './classes/role';
import { GetRandomPokemonsParameterDto } from './dtos/get-random-pokemons-parameter.dto';
import { KeyWord } from './entities/keyWord.entity';
import { PokemonTemplateSet } from './entities/pokemonTemplateSet.entity';

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
        const { name, level, roles } = template;

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
        pokemonSet.item = this.pickAtRandomFromWeightedMap(items)[0];
        pokemonSet.teraType = this.pickAtRandomFromWeightedMap(teraTypes)[0].name;
        pokemonSet.moves = this.pickAtRandomFromWeightedMap(moves);
        pokemonSet.ability = this.pickAtRandomFromWeightedMap(abilities)[0];

        // console.log(pokemonSet);
        return pokemonSet;
    }

    pickAtRandomFromWeightedMap(weightedMap: Map<string, number>): Array<KeyWord> {
        let pickedValues: Array<KeyWord> = new Array<KeyWord>();
        let totalWeight = 0;
        for (let [key, weight] of weightedMap) {

            if (weight == 1) {
                let keyword = new KeyWord();
                keyword.name = key;
                pickedValues.push(keyword);
                weightedMap.delete(key);
            }
            else totalWeight += weight;
        };
        totalWeight = Math.round(totalWeight);

        let remainingWeight = Math.random() * totalWeight;

        while (totalWeight > 0) {
            for (let [key, weight] of weightedMap) {
                if (totalWeight > 0) {
                    if (remainingWeight < weight) {
                        let keyword = new KeyWord();
                        keyword.name = key;
                        pickedValues.push(keyword);
                        weightedMap.delete(key);
                        totalWeight--;
                    }
                    remainingWeight -= weight;
                }
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


    format() {
        readFile('gen9randombattle.json', 'utf8', ((err, content) => {
            // let allSets: Array<PokemonTemplateSet> = new Array<PokemonTemplateSet>();
            const brutSets = JSON.parse(content);
            const keys = Object.keys(brutSets);
            // let index = 0;
            for (let key of keys) {
                // index++;
                let brutTemplate = brutSets[key];
                let currentTemplate = new PokemonTemplateSet;
                let brutTemplateRoles = brutTemplate.roles;
                let roleKeys = Object.keys(brutTemplateRoles);

                currentTemplate.name = key;
                currentTemplate.level = brutTemplate.level;
                currentTemplate.roles = new Array<Role>();

                for (let roleKey of roleKeys) {

                    let currentRole = new Role;
                    currentRole.name = roleKey;
                    currentRole.weight = brutTemplateRoles[roleKey].weight;
                    if (brutTemplateRoles[roleKey].abilities)
                        currentRole.abilities = new Map(Object.entries(brutTemplateRoles[roleKey].abilities));
                    else
                        currentRole.abilities = new Map();

                    if (brutTemplateRoles[roleKey].items)
                        currentRole.items = new Map(Object.entries(brutTemplateRoles[roleKey].items));
                    else
                        currentRole.items = new Map();

                    if (brutTemplateRoles[roleKey].teraTypes)
                        currentRole.teraTypes = new Map(Object.entries(brutTemplateRoles[roleKey].teraTypes));
                    else
                        currentRole.teraTypes = new Map();

                    if (brutTemplateRoles[roleKey].moves)
                        currentRole.moves = new Map(Object.entries(brutTemplateRoles[roleKey].moves));
                    else
                        currentRole.moves = new Map();

                    currentTemplate.roles.push(currentRole);
                }
                const finalTemplate = this.pokemonTemplateSetsRepository.create(currentTemplate);
                console.log(finalTemplate);
                this.pokemonTemplateSetsRepository.save(finalTemplate);
                // allSets.push(currentTemplate);
            }
            // const finalOutput = JSON.stringify(Object.fromEntries(allSets));
            // const finalOutput = JSON.stringify(allSets);
            // console.log(finalOutput);
            // writeFile('gen9randombattleformatted.json', finalOutput, (err => console.log(err)));
        }));
    }
}
