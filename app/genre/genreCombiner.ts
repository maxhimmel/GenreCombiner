import { ArrayUtil } from "../utility/arrays";
import { GenreModel } from "./genreModel";
import { GenreComboModel } from "./genreComboModel";

export class GenreCombiner
{
    get count(): number
    {
        return this._genreCombos.length;
    }

    get genreCombos(): GenreComboModel[]
    {
        return this._genreCombos;
    }

    private readonly _genreCombos: GenreComboModel[];

    constructor( genres: GenreModel[] )
    {
        ArrayUtil.fisherYatesShuffle( genres );

        const comboCount = genres.length / 2;
        this._genreCombos = new Array( comboCount );

        for ( let idx: number = 0; idx < comboCount; ++idx )
        {
            const lhs = genres[idx * 2];
            const rhs = genres[(idx * 2) + 1];

            this._genreCombos[idx] = new GenreComboModel( lhs, rhs );
        }
    }

    queueGenreForSwap( comboSlot: number, genreSlot: number ): void
    {
        const combo = this.getGenreCombo( comboSlot );
        combo.queueForSwap( genreSlot );
    }

    swapGenres( lhsComboSlot: number, rhsComboSlot: number ): void
    {
        if ( lhsComboSlot === rhsComboSlot )
        {
            throw new Error( "Cannot swap genres within the same slot." );
        }

        const lhsCombo = this.getGenreCombo( lhsComboSlot );
        const rhsCombo = this.getGenreCombo( rhsComboSlot );

        if ( lhsCombo.queuedSwapSlot === -1 || rhsCombo.queuedSwapSlot === -1 )
        {
            throw new Error(
                `One or more combos aren't queued for swapping.\n`
                + `{${lhsCombo}}.queuedSlot: ${lhsCombo.queuedSwapSlot}\n`
                + `{${rhsCombo}}.queuedSlot: ${rhsCombo.queuedSwapSlot}`
            );
        }

        const lhsGenre = lhsCombo.combo[lhsCombo.queuedSwapSlot].item;
        lhsCombo.combo[lhsCombo.queuedSwapSlot].item = rhsCombo.combo[rhsCombo.queuedSwapSlot].item;
        rhsCombo.combo[rhsCombo.queuedSwapSlot].item = lhsGenre;

        lhsCombo.isLocked.item = true;
        rhsCombo.isLocked.item = true;
    }

    cancelSwapQueue( comboSlot: number ): void
    {
        const combo = this.getGenreCombo( comboSlot );
        combo.cancelSwapQueue();
    }

    *getGenreCombos(): Generator<GenreComboModel>
    {
        for ( let idx: number = 0; idx < this._genreCombos.length; ++idx )
        {
            yield this._genreCombos[idx];
        }
    }

    getGenreCombo( comboSlot: number ): GenreComboModel
    {
        if ( comboSlot < 0 || comboSlot >= this._genreCombos.length )
        {
            throw new RangeError();
        }

        return this._genreCombos[comboSlot];
    }

    export(): GenreComboModel[]
    {
        const result: GenreComboModel[] = new Array( this._genreCombos.length );

        for ( let idx: number = 0; idx < result.length; ++idx )
        {
            const combo: GenreComboModel = this._genreCombos[idx];
            result[idx] = combo;
        }

        return result;
    }
}