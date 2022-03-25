import { rawGenres } from "../../assets/genres.json";
import { GenreModel } from "./genreModel";

class GenreDatabase
{
    public readonly count: number;

    private readonly _genres: { [id: number]: GenreModel } = {};

    constructor()
    {
        this.count = rawGenres.length;
        for ( let idx: number = 0; idx < this.count; ++idx )
        {
            const genreName: string = rawGenres[idx];
            this._genres[idx] = new GenreModel( idx, genreName );
        }
    }

    getGenre( id: number ): GenreModel
    {
        if ( id < 0 || id >= this.count )
        {
            throw new RangeError();
        }

        return this._genres[id];
    }
}

export const genreDatabase = new GenreDatabase();