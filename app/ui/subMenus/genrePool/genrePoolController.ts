import { GenreModel } from "../../../genre/genreModel";
import { GenrePool } from "../../../genre/genrePool";
import { DeltaArgs } from "../../../utility/observable";
import { ISubMenu } from "../../iSubMenu";
import { GenrePoolMenu } from "./genrePoolMenu";

export class GenrePoolController
{
    get menu(): ISubMenu
    {
        return this._menu;
    }

    private readonly _genrePool: GenrePool;
    private readonly _menu: GenrePoolMenu;

    constructor( poolSize: number )
    {
        this._genrePool = new GenrePool( poolSize );
        this._genrePool.load();

        this._menu = new GenrePoolMenu();
        this._menu.init( this._genrePool.getGenreObservables() );
        this._menu.shuffled.subscribe( this.onShuffleRequested );
    }

    private onShuffleRequested = ( sender: any, slotIndex: number ): void =>
    {
        this._genrePool.replaceGenre( slotIndex );
    }
}