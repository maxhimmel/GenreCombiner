import { GenreComboModel } from "../genre/genreComboModel";
import { ArrayUtil } from "../utility/arrays";
import { BattleResolver, BattleResult } from "./battleResolver";

export class BattleBracket
{
    get isEmpty(): boolean
    {
        return this._currentTier >= this._bracket.length;
    }

    private readonly _bracket: BattlePair[][];
    private readonly _winnerCombos: GenreComboModel[] = [];

    private _currentTier: number;
    private _currentBattleIndex: number;

    constructor( genreCombos: GenreComboModel[] )
    {
        if ( genreCombos.length % 2 !== 0 )
        {
            throw new RangeError( "Uneven array size." );
        }

        this._bracket = this.allocateBracket( genreCombos.length );
        this.generateTierPairs( 0, genreCombos );

        this._currentTier = this._currentBattleIndex = 0;
    }

    private allocateBracket( comboCount: number ): BattlePair[][]
    {
        const tiers = Math.ceil( Math.log2( comboCount ) );
        const bracket: BattlePair[][] = new Array( tiers );

        for ( let idx: number = 1; idx <= tiers; ++idx )
        {
            let battleCount = Math.ceil( comboCount / ( idx * 2 ) );

            if ( this.isFinalTier( idx, tiers ) || this.isUnevenBattleCount( battleCount ) )
            {
                --battleCount;
                battleCount = Math.max( 1, battleCount );
            }

            bracket[idx - 1] = new Array( battleCount );
        }

        return bracket;
    }

    private isFinalTier( index: number, tierCount: number ): boolean
    {
        return index === tierCount;
    }

    private isUnevenBattleCount( count: number ): boolean
    {
        return count % 2 !== 0;
    }

    private generateTierPairs( tier: number, genreCombos: GenreComboModel[] ): void
    {
        if ( genreCombos.length % 2 !== 0 )
        {
            throw new RangeError( "Uneven array size." );
        }

        const randomIndices = ArrayUtil.createRange( genreCombos.length );
        ArrayUtil.fisherYatesShuffle( randomIndices );

        const battleTier: BattlePair[] = this.getBattlesInTier( tier );
        for ( let idx: number = 0; idx < battleTier.length; ++idx )
        {
            const lhsIndex: number = randomIndices[idx * 2];
            const lhsCombo: GenreComboModel = genreCombos[lhsIndex];

            const rhsIndex: number = randomIndices[( idx * 2 ) + 1];
            const rhsCombo: GenreComboModel = genreCombos[rhsIndex];

            battleTier[idx] = new BattlePair( lhsCombo, rhsCombo );
        }
    }

    resolveNextBattle(): BattleResult
    {
        if ( this.isEmpty )
        {
            throw new RangeError();
        }

        const battle = this.getBattlePair( this._currentTier, this._currentBattleIndex );
        const resolver = new BattleResolver( battle.lhsCombo, battle.rhsCombo );
        const result = resolver.resolve();

        this._winnerCombos.push( result.winner );

        this.queueNextBattle();
        return result;
    }

    private getBattlePair( tier: number, battleIndex: number ): BattlePair
    {
        const battles: BattlePair[] = this.getBattlesInTier( tier );

        if ( battleIndex < 0 || battleIndex >= battles.length )
        {
            throw new RangeError();
        }

        return battles[battleIndex];
    }

    private getBattlesInTier( tier: number ): BattlePair[]
    {
        if ( tier < 0 || tier >= this._bracket.length )
        {
            throw new RangeError();
        }

        return this._bracket[tier];
    }

    private queueNextBattle(): void
    {
        ++this._currentBattleIndex;
        
        const battles = this.getBattlesInTier( this._currentTier );
        if ( this._currentBattleIndex >= battles.length )
        {
            ++this._currentTier;
            this._currentBattleIndex = 0;

            if ( !this.isEmpty )
            {
                this.generateTierPairs( this._currentTier, this._winnerCombos );
                ArrayUtil.clear( this._winnerCombos );
            }
        }
    }
}

export class BattlePair
{
    lhsCombo: GenreComboModel;
    rhsCombo: GenreComboModel;

    constructor( lhsCombo: GenreComboModel, rhsCombo: GenreComboModel )
    {
        this.lhsCombo = lhsCombo;
        this.rhsCombo = rhsCombo;
    }

    toString(): string
    {
        return `[${this.lhsCombo}] >< [${this.rhsCombo}]`;
    }
}