import { GenrePool } from "../../../genre/genrePool";
import { SubMenuRequest } from "../../menuContainer";
import { GenrePoolMenu } from "./genrePoolMenu";

export class GenrePoolController
{
    private readonly _genrePool: GenrePool;

    constructor( poolSize: number )
    {
        this._genrePool = new GenrePool( poolSize );
        this._genrePool.load();
    }
    
    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( ( root: HTMLElement ) =>
        {
            const menu = new GenrePoolMenu( root, this._genrePool.getGenreObservables(), this._genrePool.replacementCount );
            menu.shuffled.subscribe( this.onShuffleRequested );

            return menu;
        } );
    }

    private onShuffleRequested = ( sender: any, slotIndex: number ): void =>
    {
        this._genrePool.replaceGenre( slotIndex );
    }
}