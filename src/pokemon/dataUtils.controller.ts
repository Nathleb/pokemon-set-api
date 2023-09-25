import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { DataFromSdService } from './services/dataFromShowdown.service';
import { DataUtilsService } from './services/dataUtils.service';


@Controller('data')
export class DataUtilsController {

    constructor(private readonly dataUtilsService: DataUtilsService, private readonly dataFromSd: DataFromSdService) { };


    // @Get('/pokemons')
    // formatAndSaveGen9RandomBattleJson() {
    //     this.dataUtilsService.formatAndSaveGen9RandomBattleJson();
    //     this.dataUtilsService.finirdata();
    // };

    // @Get('/abilities')
    // fetchAndSaveAbilities() {
    //     this.dataUtilsService.fetchAndSaveAbilities();
    // };
    // @Get('/items')
    // fetchAndSaveItems() {
    //     this.dataUtilsService.fetchAndSaveItems();
    // };

    // @Get('/moves')
    // fetchAndSaveMoves() {
    //     this.dataUtilsService.fetchAndSaveMoves();
    // };


    // @Get('/keyWords')
    // fetchAndSaveAbilities() {
    //     this.dataFromSd.addKeyWordsToDb();
    // };
    // @Get('/moves')
    // fetchAndSaveMoves() {
    //     this.dataFromSd.addMovesToDb();
    // };
}
