import { Body, Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { GetRandomPokemonsParameterDto } from './dtos/get-random-pokemons-parameter.dto';
import { PokemonService } from './services/pokemon.service';

@Controller('pokemons')
export class PokemonController {

    constructor(private readonly pokemonService: PokemonService) { };

    // @Get('/randomSample')
    // async getRandomPokemons(@Query(ValidationPipe) parameters: GetRandomPokemonsParameterDto) {
    //     return this.pokemonService.findManyAtRandom(parameters);
    // }

}
