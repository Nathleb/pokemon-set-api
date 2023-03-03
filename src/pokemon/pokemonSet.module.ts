import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemonSet.controller';
import { PokemonService } from './services/pokemon.service';
import { PokemonTemplateSet } from './entities/pokemonTemplateSet.entity';
import { PokemonRepository } from './pokemonSet.repository';
import { DataUtilsService } from './services/dataUtils.service';
import { DataUtilsController } from './dataUtils.controller';
import { KeyWord } from './entities/keyWord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonTemplateSet, KeyWord])],
  controllers: [PokemonController, DataUtilsController],
  providers: [PokemonService, PokemonRepository, DataUtilsService],
})
export class PokemonModule { }