import { Injectable } from "@nestjs/common";
import { readFile } from "fs";
import { Role } from "../classes/role";
import { PokemonTemplateSet } from "../entities/pokemonTemplateSet.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { MongoRepository, QueryFailedError } from "typeorm";
import { PokemonClient, MoveClient, ItemClient } from 'pokenode-ts';
import { KeyWord } from "../entities/keyWord.entity";
import { createInterface } from "readline";




@Injectable()
export class DataUtilsService {

    constructor(@InjectRepository(PokemonTemplateSet) private pokemonTemplateSetsRepository: MongoRepository<PokemonTemplateSet>,
        @InjectRepository(KeyWord) private keyWordRepository: MongoRepository<KeyWord>) { };

    formatAndSaveGen9RandomBattleJson() {
        readFile('gen9randombattle.json', 'utf8', (async (err, content) => {
            const brutSets = JSON.parse(content);
            const keys = Object.keys(brutSets);
            for (let key of keys) {
                let brutTemplate = brutSets[key];
                let currentTemplate = new PokemonTemplateSet;
                let brutTemplateRoles = brutTemplate.roles;
                let roleKeys = Object.keys(brutTemplateRoles);

                currentTemplate.name = key;
                currentTemplate.level = brutTemplate.level;
                currentTemplate.roles = new Array<Role>();
                currentTemplate = await this.fetchAndUpdateBaseStatsAndTypes(key, currentTemplate);

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
                // console.log(finalTemplate);
                this.pokemonTemplateSetsRepository.insert(finalTemplate);
            }
        }));
    }

    fetchAndSaveAbilities() {
        let abilities = new Set<string>();
        const api = new PokemonClient();

        readFile('gen9randombattle.json', 'utf8', ((err, content) => {
            const brutSets = JSON.parse(content);
            const keys = Object.keys(brutSets);
            for (let key of keys) {
                let brutTemplateAbilities = brutSets[key].abilities;
                if (brutTemplateAbilities)
                    Object.keys(brutTemplateAbilities).forEach(name => abilities.add(name));
            }
            console.log(abilities.size);
            console.log(abilities);

            Array.from(abilities).forEach(async name => {
                name = name.replace(/ /g, "-").toLowerCase();
                name = name.replace(/[()]/g, "");
                await api
                    .getAbilityByName(name)
                    .then(async (data) => {
                        let ability = new KeyWord();
                        ability.name = this.capitalizeWords(name.replace(/-/g, ' '));
                        ability.description = data.effect_entries.find(ab => ab.language.name == "en") != undefined ? data.effect_entries.find(ab => ab.language.name == "en")?.short_effect as string : "d";
                        ability.type = "ability";
                        ability = this.keyWordRepository.create(ability);
                        try {
                            await this.keyWordRepository.save(ability);
                        } catch (error) {
                            if (error.name === 'BulkWriteError') {

                            } else {
                                throw error;
                            }
                        }
                        setTimeout(() => { }, 1000);
                    }).catch((error) => console.error(this.capitalizeWords(name.replace(/-/g, ' '))));
            });

        }));
    }

    async fetchAndSaveItems() {
        let items = new Set<string>();
        const api = new ItemClient();

        readFile('gen9randombattle.json', 'utf8', ((err, content) => {
            const brutSets = JSON.parse(content);
            const keys = Object.keys(brutSets);
            for (let key of keys) {
                let brutTemplateItems = brutSets[key].items;
                if (brutTemplateItems)
                    Object.keys(brutTemplateItems).forEach(name => items.add(name));
            }
            console.log(items.size);
            console.log(items);

            Array.from(items).forEach(name => {
                name = name.replace(/ /g, '-').toLowerCase();
                api
                    .getItemByName(name)
                    .then(async (data) => {
                        let item = new KeyWord();
                        item.name = this.capitalizeWords(name.replace(/-/g, ' '));
                        if (data.effect_entries.length > 0)
                            item.description = data.effect_entries[0].short_effect;
                        else
                            item.description = data.flavor_text_entries.find(lang => lang.language.name == "en") != undefined ? data.flavor_text_entries.find(lang => lang.language.name == "en")?.text as string : "d";
                        item.type = "item";
                        item = this.keyWordRepository.create(item);
                        try {
                            await this.keyWordRepository.save(item);
                        } catch (error) {
                            if (error.name === 'BulkWriteError') {
                                console.log('Document already exists');
                            }
                            else {
                                throw error;
                            }
                        }
                        setTimeout(() => { }, 1000);
                    }
                    )
                    .catch((error) => console.error(name));
            });
        }));
    }

    fetchAndSaveMoves() {

    }

    async fetchAndUpdateBaseStatsAndTypes(name: string, currentTemplate: PokemonTemplateSet) {
        const api = new PokemonClient();
        await api.getPokemonByName(name.replace(/ /g, "-").toLowerCase()).then((pokemon) => {
            currentTemplate.sprite = pokemon.sprites.front_default ? pokemon.sprites.front_default : "d";

            if (pokemon.stats) {
                currentTemplate.baseStats = new Map<string, number>();
                pokemon.stats.forEach(pokemonStats => {
                    currentTemplate.baseStats.set(pokemonStats.stat.name, pokemonStats.base_stat);
                });
            }
            if (pokemon.types) {
                currentTemplate.types = new Array<string>();
                pokemon.types.forEach(pokemonType => {
                    currentTemplate.types.push(pokemonType.type.name);
                });
            }

        }).catch((error) => console.error(this.capitalizeWords(name)));
        setTimeout(() => { }, 200);
        return currentTemplate;
    }


    capitalizeWords(str: string) {
        return str.replace(/\b\w/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    async finirdata() {
        let data = await this.pokemonTemplateSetsRepository.find({
            where: {
                name: {
                    $in: ["Oricorio-Pa'u"
                    ]
                }
            }
        });


        for (let pokemon of data) {
            await this.promptUser(pokemon);
            console.log(pokemon);
            this.pokemonTemplateSetsRepository.save(pokemon);
        }
    }

    async promptUser(pokemon: PokemonTemplateSet) {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const baseStatsInput: string = await new Promise(resolve => {
            rl.question(`Enter the baseStats for ${pokemon.name}: `, resolve);
        });
        const baseStatsArray = baseStatsInput.split(' ');
        const baseStatsMap = new Map();
        for (let i = 0; i < baseStatsArray.length; i += 2) {
            const statName = baseStatsArray[i];
            const statValue = parseInt(baseStatsArray[i + 1], 10);
            baseStatsMap.set(statName, statValue);
        }
        pokemon.baseStats = baseStatsMap;

        const typesInput: string = await new Promise(resolve => {
            rl.question(`Enter the types for ${pokemon.name}: `, resolve);
        });
        const typesArray = typesInput.split(' ');
        pokemon.types = typesArray;

        const spriteInput: string = await new Promise(resolve => {
            rl.question(`Enter the sprite url for ${pokemon.name}: `, resolve);
        });
        const spriteArray = spriteInput.split(' ');
        pokemon.sprite = spriteArray[0];

        rl.close();
    }
}