import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { GetRandomPokemonsParameterDto } from './dtos/get-random-pokemons-parameter.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemons')
export class PokemonController {

    constructor(private readonly pokemonService: PokemonService) { };



    @Get('/randomSample')
    async getRandomPokemons(@Body() parameters: GetRandomPokemonsParameterDto) {
        return this.pokemonService.findManyAtRandom(parameters);
    }

}
