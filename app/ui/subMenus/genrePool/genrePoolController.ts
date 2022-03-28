import { GenrePool } from "../../../genre/genrePool";
import { DeltaArgs } from "../../../utility/observable";
import { SubMenuRequest } from "../../menuContainer";
import { GenreCombinerController } from "../genreCombiner/genreCombinerController";
import { IController } from "../iController";
import { GenrePoolMenu } from "./genrePoolMenu";

export class GenrePoolController implements IController
{
    private readonly _genrePool: GenrePool;
    private _menu: GenrePoolMenu | null = null;

    constructor( poolSize: number )
    {
        this._genrePool = new GenrePool( poolSize );
        this._genrePool.load();

        this._genrePool.replacementCount.changed.subscribe( this.onReplacementsDepleted );
    }
    
    private onReplacementsDepleted = ( sender: any, changeArgs: DeltaArgs<number> ): void =>
    {
        if ( changeArgs.current <= 0 )
        {
            this._menu?.setReplacingActive( false );
        }
    }

    createSubMenuRequest(): SubMenuRequest
    {
        return new SubMenuRequest( ( root: HTMLElement ) =>
        {
            this._menu = new GenrePoolMenu( root, this._genrePool.getGenreObservables(), this._genrePool.replacementCount );
            this._menu.shuffled.subscribe( this.onShuffleRequested );

            return this._menu;
        } );
    }

    private onShuffleRequested = ( sender: any, slotIndex: number ): void =>
    {
        this._genrePool.replaceGenre( slotIndex );
    }

    getNextController(): IController
    {
        return new GenreCombinerController( this._genrePool.export() );
    }
}