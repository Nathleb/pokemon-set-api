import { Module } from '@nestjs/common';
import { PokemonTemplateSet } from './pokemon/entities/pokemonTemplateSet.entity';
import { PokemonModule } from './pokemon/pokemonSet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyWord } from './pokemon/entities/keyWord.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://@cluster0.ugzwt.mongodb.net/PokemonRand9',
      useNewUrlParser: true,
      logging: true,
      entities: [PokemonTemplateSet, KeyWord],
      synchronize: true,
      useUnifiedTopology: true,
      ssl: true,
    }),
    PokemonModule,
  ]
})
export class AppModule { }