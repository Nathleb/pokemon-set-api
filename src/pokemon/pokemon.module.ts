import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokemonTemplateSet } from './entities/pokemonTemplateSet.entity';
import { PokemonRepository } from './pokemon.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonTemplateSet])],
  controllers: [PokemonController],
  providers: [PokemonService, PokemonRepository],
})
export class PokemonModule { }