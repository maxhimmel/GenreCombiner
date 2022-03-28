import { GenreComboModel } from "../genre/genreComboModel";
import { Observable } from "../utility/observable";

export class BattleAssigner
{
    get comboCount(): number
    {
        return this._genreCombos.length;    
    }

    readonly remainingPoints: Observable<number>;

    private readonly _genreCombos: GenreComboModel[];

    constructor( genreCombos: GenreComboModel[] )
    {
        this._genreCombos = genreCombos;

        const pointAllotment = genreCombos.length * 2;
        this.remainingPoints = new Observable( this, pointAllotment );
    }

    addBattlePoint( comboSlot: number ): void
    {
        if ( this.remainingPoints.item <= 0 )
        {
            throw new RangeError( "Cannot assign anymore battle points." );
        }

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

        if ( points <= 0 )
        {
            throw new RangeError( "Cannot remove anymore battle points." );
        }

        combo.removeBattlePoint();
        ++this.remainingPoints.item;
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

    export(): GenreComboModel[]
    {
        const result: GenreComboModel[] = new Array( this._genreCombos.length );
        
        for ( let idx: number = 0; idx < result.length; ++idx )
        {
            result[idx] = this._genreCombos[idx];
        }

        return result;
    }
}