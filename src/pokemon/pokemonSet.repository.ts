import { Injectable } from "@nestjs/common";
import { readFile } from "fs/promises";

@Injectable()
export class PokemonRepository {

    async findOne(id: string) {
        const contents = await readFile('pokemonbdd.json', 'utf8');
        const pokemonSets = JSON.parse(contents);
        return pokemonSets[id];
    }

    async findAll() {
        const contents = await readFile('pokemonbdd.json', 'utf8');
        return JSON.parse(contents);
    }

    async findManyAtRandom(size: number) {
        const contents = await readFile('pokemonbdd.json', 'utf8');
        const pokemonSets = JSON.parse(contents);
        const pokemonSetsSize = Object.keys(pokemonSets).length;

        let randomPokemonSets = new Set();
        while (randomPokemonSets.size < size && randomPokemonSets.size < pokemonSetsSize) {
            let value = (Math.floor(Math.random() * pokemonSetsSize) + 1).toString();
            randomPokemonSets.add(pokemonSets[value]);
        }

        return Array.from(randomPokemonSets);
    }
}