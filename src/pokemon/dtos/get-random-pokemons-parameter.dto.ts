import { IsNumberString } from "class-validator";

export class GetRandomPokemonsParameterDto {
    @IsNumberString()
    size: string;
}