import { Module } from '@nestjs/common';
import { PokemonTemplateSet } from './pokemon/entities/pokemonTemplateSet.entity';
import { PokemonModule } from './pokemon/pokemonSet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyWord } from './pokemon/entities/keyWord.entity';
import { Move } from './pokemon/entities/move.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mongodb',
          url: `mongodb+srv://${config.get<string>("DATABASE_USER")}:${config.get<string>("DATABASE_PASSWORD")}@cluster0.ugzwt.mongodb.net/PokemonRand9`,
          useNewUrlParser: true,
          logging: true,
          entities: [PokemonTemplateSet, KeyWord, Move],
          synchronize: true,
          useUnifiedTopology: true,
          ssl: true,
        };
      }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PokemonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }

  ]
})
export class AppModule { }