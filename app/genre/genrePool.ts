import { genreDatabase } from "./genreDatabase";
import { GenreModel } from "./genreModel";
import { ArrayUtil } from "../utility/arrays";
import { IEvent } from "../utility/events/ievent";
import { DeltaArgs, Observable } from "../utility/observable";

export class GenrePool
{
    private _nextGenreIndex: number = 0;
    private _genreIndices: number[] = [];
    private _genres: Observable<GenreModel>[] = [];

    // TODO:
    // We could also separate this out into 2 functions:
        // allocate(size)
        // load()
    // This would be helpful as such:
        // pool.allocate(4)
        // forEach( pool.getGenreChangedEvents(), (event) => { event.subscribe( onGenreChanged ); } )
        // pool.load()

    init( size: number ): void
    {
        this.initRandomIndices();
        this.initGenrePool( size );
    }

    private initRandomIndices(): void
    {
        this._genreIndices = ArrayUtil.createRange( genreDatabase.count );
        ArrayUtil.fisherYatesShuffle( this._genreIndices );
    }

    private initGenrePool( size: number ): void
    {
        this._genres = new Array( size );
        for ( let idx = 0; idx < size; ++idx )
        {
            const nextGenre = this.getNextGenre();
            this._genres[idx] = new Observable( this, nextGenre );
        }
    }

    private getNextGenre(): GenreModel
    {
        if ( this.isPoolEmpty() )
        {
            throw new RangeError();
        }

        const randIdx = this._genreIndices[this._nextGenreIndex];
        const randGenre = genreDatabase.getGenre( randIdx );

        ++this._nextGenreIndex;
        return randGenre;
    }

    replaceGenre( slotIndex: number )
    {
        if ( this.isPoolEmpty() )
        {
            throw new RangeError();
        }

        const genreObservable = this._genres[slotIndex];
        genreObservable.item = this.getNextGenre();
    }

    isPoolEmpty(): boolean
    {
        return this._nextGenreIndex < 0 || this._nextGenreIndex >= this._genreIndices.length;
    }

    *getGenreChangedEvents(): Generator<IEvent<DeltaArgs<GenreModel>>>
    {
        for ( let idx: number = 0; idx < this._genres.length; ++idx )
        {
            yield this._genres[idx].changed;
        }
    }
}