import { genreDatabase } from "./genreDatabase";
import { GenreModel } from "./genreModel";
import { ArrayUtil } from "../utility/arrays";
import { IEvent } from "../utility/events/iEvent";
import { DeltaArgs, Observable } from "../utility/observable";

export class GenrePool
{
    get count(): number
    {
        return this._genres.length;
    }

    get unusedGenreCount(): number
    {
        return this._genreIndices.length - this._nextGenreIndex;
    }

    get isPoolEmpty(): boolean
    {
        return this._nextGenreIndex < 0 || this._nextGenreIndex >= this._genreIndices.length;
    }

    private _nextGenreIndex: number;
    private readonly _genreIndices: number[];
    private readonly _genres: Observable<GenreModel>[];

    constructor( size: number )
    {
        this._nextGenreIndex = 0;
        this._genreIndices = this.allocateRandomIndices();
        this._genres = this.allocateGenrePool( size );
    }

    private allocateRandomIndices(): number[]
    {
        const result = ArrayUtil.createRange( genreDatabase.count );
        ArrayUtil.fisherYatesShuffle( result );

        return result;
    }

    private allocateGenrePool( size: number ): Observable<GenreModel>[]
    {
        const result = new Array<Observable<GenreModel>>( size );
        for ( let idx = 0; idx < size; ++idx )
        {
            result[idx] = new Observable( this, GenreModel.empty );
        }

        return result;
    }

    load(): void
    {
        for ( let idx = 0; idx < this._genres.length; ++idx )
        {
            this.replaceGenre( idx );
        }
    }

    replaceGenre( slotIndex: number )
    {
        if ( this.isPoolEmpty )
        {
            throw new RangeError();
        }

        const genreObservable = this._genres[slotIndex];
        genreObservable.item = this.getNextGenre();
    }

    private getNextGenre(): GenreModel
    {
        if ( this.isPoolEmpty )
        {
            throw new RangeError();
        }

        const randIdx = this._genreIndices[this._nextGenreIndex++];
        const randGenre = genreDatabase.getGenre( randIdx );

        return randGenre;
    }

    *getGenreChangedEvents(): Generator<IEvent<DeltaArgs<GenreModel>>>
    {
        for ( let idx: number = 0; idx < this._genres.length; ++idx )
        {
            yield this._genres[idx].changed;
        }
    }

    export(): GenreModel[]
    {
        const genres: GenreModel[] = new Array( this._genres.length );
        for ( let idx: number = 0; idx < genres.length; ++idx )
        {
            const genreObservable = this._genres[idx];
            genres[idx] = genreObservable.item;
        }

        return genres;
    }
}