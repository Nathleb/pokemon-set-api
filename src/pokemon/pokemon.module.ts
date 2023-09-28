import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemonSet.controller';
import { PokemonService } from './services/pokemon.service';
import { PokemonTemplateSet } from './entities/pokemonTemplateSet.entity';
import { KeyWord } from './entities/keyWord.entity';
import { Move } from './entities/move.entity';
import { KeyWordService } from './services/keyWord.service';
import { MoveService } from './services/move.service';

@Module({
  imports: [TypeOrmModule.forFeature([PokemonTemplateSet, KeyWord, Move])],
  controllers: [PokemonController],
  providers: [PokemonService, KeyWordService, MoveService],
  exports: [PokemonService]
})
export class PokemonModule { }