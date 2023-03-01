# PokemonSetsApi

Simple Api to fetch pokemon sets from the current **[pokemonShowdown](https://play.pokemonshowdown.com/)** \[gen9\]Random Battle pool

The API is callable via <http://localhost:3000//pokemons/randomSample> and can be given parameters through the request body :

``{
  "size": 6
}``

the response is formatted as follow:

``
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
    }
``
