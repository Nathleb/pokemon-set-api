import { Module } from '@nestjs/common';
import { TemplateSet } from './pokemon/entities/templateSet.entity';
import { PokemonModule } from './pokemon/pokemon.module';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://@cluster0.ugzwt.mongodb.net/PokemonSetsTemplates',
      useNewUrlParser: true,
      logging: true,
      entities: [TemplateSet],
      synchronize: true,
      useUnifiedTopology: true
    }),
    PokemonModule,
  ]
})
export class AppModule { }