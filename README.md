# PokemonSetsApi

Simple Api to fetch pokemon sets from the current **[pokemonShowdown](https://play.pokemonshowdown.com/)** \[gen9\]Random Battle pool

The API is callable via <http://localhost:3000//pokemons/randomSample> and can be given parameters through the request body :

```yaml
{
  "size": 2
}
```

the response is formatted as follow:

```yaml
[
{
  "name": "Gardevoir",
  "level": 84,
  "role": "Fast Attacker",
  "item": {
      "name": "Choice Scarf"
  },
  "teraType": "Fighting",
  "moves": [
      {
          "name": "Moonblast"
      },
      {
          "name": "Focus Blast"
      },
      {
          "name": "Psychic"
      },
      {
          "name": "Psyshock"
      }
  ],
  "ability": {
      "name": "Trace"
  }
},
    {
        "name": "Tyranitar",
        "level": 81,
        "role": "Bulky Support",
        "item": {
            "name": "Leftovers"
        },
        "teraType": "Rock",
        "moves": [
            {
                "name": "Crunch"
            },
            {
                "name": "Stone Edge"
            },
            {
                "name": "Stealth Rock"
            },
            {
                "name": "Ice Beam"
            }
        ],
        "ability": {
            "name": "Sand Stream"
        }
    }
]
```
