import { Random } from "../utility/random";
import { GenreComboModel } from "../genre/genreComboModel";

// See: https://riskodds.com
export class BattleResolver
{
    private readonly DIE_MIN: number = 1;
    private readonly DIE_MAX: number = 6;

    private readonly _lhsCombo: GenreComboModel;
    private readonly _rhsCombo: GenreComboModel;
    
    private _lhsRollCount: number;
    private _rhsRollCount: number;

    constructor( lhsCombo: GenreComboModel, rhsCombo: GenreComboModel )
    {
        this._lhsCombo = lhsCombo;
        this._rhsCombo = rhsCombo;

        this._lhsRollCount = 1 + lhsCombo.battlePoints;
        this._rhsRollCount = 1 + rhsCombo.battlePoints;
    }

    resolve(): BattleResult
    {
        const rounds: BattleRound[] = [];

        while ( this.isBattling() )
        {
            const lhsDice: number[] = this.createDiceRolls( this._lhsRollCount );
            const rhsDice: number[] = this.createDiceRolls( this._rhsRollCount );

            const round = this.resolveRound( rounds.length, lhsDice, rhsDice );
            rounds.push( round );
        }

        return this.buildResult( rounds );
    }

    private isBattling(): boolean
    {
        return this._lhsRollCount > 0 && this._rhsRollCount > 0;
    }

    private createDiceRolls( count: number ): number[]
    {
        const dice = new Array<number>( count );
        for ( let idx: number = 0; idx < count; ++idx )
        {
            dice[idx] = Random.range( this.DIE_MIN, this.DIE_MAX + 1 );
        }
        dice.sort( this.sortHighToLow );

        return dice;
    }

    private sortHighToLow( lhs: number, rhs: number ): number
    {
        return rhs - lhs;
    }

    private resolveRound( index: number, lhsDice: number[], rhsDice: number[] ): BattleRound
    {
        const round = new BattleRound( index, lhsDice, rhsDice );

        const maxRolls = Math.min( this._lhsRollCount, this._rhsRollCount );
        for ( let idx: number = 0; idx < maxRolls; ++idx )
        {
            const lhsDie = lhsDice[idx];
            const rhsDie = rhsDice[idx];

            const winningSide = this.getWinningSide( lhsDie, rhsDie, this._lhsRollCount, this._rhsRollCount );
            round.winners.push( winningSide );

            if ( winningSide < 0 )
            {
                --this._rhsRollCount;
            }
            else if ( winningSide > 0 )
            {
                --this._lhsRollCount;
            }
        }

        return round;
    }

    private getWinningSide( lhsDie: number, rhsDie: number, lhsRollCount: number, rhsRollCount: number ): GenreSide
    {
        if ( rhsDie > lhsDie )
        {
            return 1;
        }
        else if ( lhsDie > rhsDie )
        {
            return -1;
        }
        else if ( lhsRollCount !== rhsRollCount )
        {
            return lhsRollCount < rhsRollCount
                ? -1
                : 1;
        }

        return 0;
    }

    private buildResult(rounds: BattleRound[]): BattleResult
    {
        const winner = this._lhsRollCount > 0 ? this._lhsCombo : this._rhsCombo;
        const loser = this._lhsRollCount <= 0 ? this._lhsCombo : this._rhsCombo;

        return new BattleResult( winner, loser, this._lhsCombo, this._rhsCombo, rounds );
    }
}

export class BattleResult
{
    readonly winner: GenreComboModel;
    readonly loser: GenreComboModel;
    readonly lhsCombo: GenreComboModel;
    readonly rhsCombo: GenreComboModel;
    readonly rounds: BattleRound[];

    constructor( winner: GenreComboModel, loser: GenreComboModel, lhsCombo: GenreComboModel, rhsCombo: GenreComboModel, rounds: BattleRound[] )
    {
        this.winner = winner;
        this.loser = loser;
        this.lhsCombo = lhsCombo;
        this.rhsCombo = rhsCombo;
        this.rounds = rounds;
    }
}

export class BattleRound
{
    readonly index: number;
    readonly lhsDiceRolls: number[];
    readonly rhsDiceRolls: number[];
    readonly winners: GenreSide[] = [];

    constructor( index: number, lhsRolls: number[], rhsRolls: number[] )
    {
        this.index = index;
        this.lhsDiceRolls = lhsRolls;
        this.rhsDiceRolls = rhsRolls;
    }

    getWinningSide(): GenreSide
    {
        let sum: number = 0;

        for ( const winningSide of this.winners )
        {
            sum += winningSide;
        }

        return Math.sign( sum ) as GenreSide;
    }
}

export type GenreSide = -1 | 0 | 1;