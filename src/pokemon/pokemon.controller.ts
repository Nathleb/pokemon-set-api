import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { GetRandomPokemonsParameterDto } from './dtos/get-random-pokemons-parameter.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemons')
export class PokemonController {

    constructor(public pokemonService: PokemonService) { };


    @Get()
    getAllPokemon() {
        return this.pokemonService.findAll();
    }

    @Get('/randomSample')
    async getRandomPokemons(@Body() body: GetRandomPokemonsParameterDto) {
        return this.pokemonService.findManyAtRandom(body.size);
    }

    @Get('/:id')
    getPokemon(@Param('id') id: string) {
        return this.pokemonService.findOne(id);
    }


}
