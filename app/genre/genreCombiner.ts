import { ArrayUtil } from "../utility/arrays";
import { GenreModel } from "./genreModel";
import { GenreComboModel } from "./genreComboModel";

export class GenreCombiner
{
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
        if ( comboSlot < 0 || comboSlot >= this._genreCombos.length )
        {
            throw new RangeError();
        }

        const combo = this._genreCombos[comboSlot];
        combo.queueForSwap( genreSlot );
    }

    swapGenres( lhsComboSlot: number, rhsComboSlot: number ): void
    {
        if ( lhsComboSlot < 0 || lhsComboSlot >= this._genreCombos.length )
        {
            throw new RangeError();
        }
        if ( rhsComboSlot < 0 || rhsComboSlot >= this._genreCombos.length )
        {
            throw new RangeError();
        }
        if ( lhsComboSlot === rhsComboSlot )
        {
            throw new Error( "Cannot swap genres within the same slot." );
        }

        const lhsCombo = this._genreCombos[lhsComboSlot];
        const rhsCombo = this._genreCombos[rhsComboSlot];

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
        if ( comboSlot < 0 || comboSlot >= this._genreCombos.length )
        {
            throw new RangeError();
        }

        const combo = this._genreCombos[comboSlot];
        combo.cancelSwapQueue();
    }

    *getGenreCombos(): Generator<GenreComboModel>
    {
        for ( let idx: number = 0; idx < this._genreCombos.length; ++idx )
        {
            yield this._genreCombos[idx];
        }
    }
}