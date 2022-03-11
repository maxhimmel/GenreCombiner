import { GenreComboModel } from "../genre/genreComboModel";
import { Observable } from "../utility/observable";

export class BattleAssigner
{
    readonly remainingPoints: Observable<number>;

    private readonly _genreCombos: GenreComboModel[];

    constructor( pointAllotment: number, genreCombos: GenreComboModel[] )
    {
        this._genreCombos = genreCombos;
        this.remainingPoints = new Observable( this, pointAllotment );
    }

    addBattlePoint( comboSlot: number ): void
    {
        if ( this.remainingPoints.item > 0 )
        {
            const combo = this.getGenreCombo( comboSlot );

            combo.addBattlePoint();
            --this.remainingPoints.item;
        }
    }

    removeBattlePoint( comboSlot: number ): void
    {
        const combo = this.getGenreCombo( comboSlot );
        const points = combo.battlePoints;

        if ( points > 0 )
        {
            combo.removeBattlePoint();
            ++this.remainingPoints.item;
        }
    }

    private getGenreCombo( index: number ): GenreComboModel
    {
        if ( index < 0 || index >= this._genreCombos.length )
        {
            throw new RangeError();
        }

        return this._genreCombos[index];
    }

    *getGenreCombos(): Generator<GenreComboModel>
    {
        for ( let combo of this._genreCombos )
        {
            yield combo;
        }
    }
}