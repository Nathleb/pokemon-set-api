import { Injectable } from '@nestjs/common';
import { GetRandomPokemonsParameterDto } from './dtos/get-random-pokemons-parameter.dto';
import { PokemonRepository } from './pokemon.repository';

@Injectable()
export class PokemonService {

    constructor(public pokemonRepository: PokemonRepository) { };

    findOne(id: string) {
        return this.pokemonRepository.findOne(id);
    }

    findAll() {
        return this.pokemonRepository.findAll();
    }

    findManyAtRandom(size: number) {
        return this.pokemonRepository.findManyAtRandom(size);
    }
}
