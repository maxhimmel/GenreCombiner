import { BattleAssigner } from "./battle/battleAssigner";
import { BattleBracket } from "./battle/battleBracket";
import { BattleResult, BattleRound } from "./battle/battleResolver";
import { GenreCombiner } from "./genre/genreCombiner";
import { GenreComboModel } from "./genre/genreComboModel";
import { GenreModel } from "./genre/genreModel";
import { GenrePool } from "./genre/genrePool";
import { ArrayUtil } from "./utility/arrays";
import { AsyncUtil } from "./utility/async";
import { DeltaArgs } from "./utility/observable";
import { Random } from "./utility/random";

class IntegrationTests
{
    private readonly TEST_DELAY: number = 1;

    async run(): Promise<void>
    {
        console.error( "Starting integration testing ..." );
        await AsyncUtil.delay( 1 );

        /*-------------------------*/

        console.error( "Creating GenrePool ..." );
        const genrePool: GenrePool = this.testPoolInitialization();
        await AsyncUtil.delay( this.TEST_DELAY );
        
        console.error( "Replacing GenrePool items ..." );
        this.testPoolReplacement( genrePool );
        await AsyncUtil.delay( this.TEST_DELAY );


        console.error( "Creating GenreCombiner ..." );
        const genreCombiner: GenreCombiner = this.testCombinerInitialization( genrePool.export() );
        await AsyncUtil.delay( this.TEST_DELAY );

        console.error( "Swapping GenreCombiner items ..." );
        this.testCombinerSwapping( genreCombiner );
        await AsyncUtil.delay( this.TEST_DELAY );


        console.error( "Creating BattleAssigner ..." );
        const battleAssigner: BattleAssigner = this.testBattleAssignerInitialization( genreCombiner.export() );
        await AsyncUtil.delay( this.TEST_DELAY );

        console.error( "Adding battle points ..." );
        this.testBattlePointAdding( battleAssigner );
        await AsyncUtil.delay( this.TEST_DELAY );

        console.error( "Creating BattleBracket ..." );
        const battleBracket: BattleBracket = this.testBattleBracketInitialization( battleAssigner.export() );
        await AsyncUtil.delay( this.TEST_DELAY );

        console.error( "Resolving all battles ..." );
        this.testBattling( battleBracket );
        await AsyncUtil.delay( this.TEST_DELAY );
    }

    //#region GenrePool
    private testPoolInitialization(): GenrePool
    {
        const poolSize: number = this.getRandomPoolSize();
        const genrePool: GenrePool = new GenrePool( poolSize );
        console.warn( `GenrePool created of size ${poolSize}.` );

        for ( let genre of genrePool.getGenreObservables() )
        {
            genre.changed.subscribe( this.onGenrePoolChanged );
        }

        genrePool.load();

        for ( let genre of genrePool.getGenreObservables() )
        {
            genre.changed.unsubscribe( this.onGenrePoolChanged );
        }

        return genrePool;
    }

    private getRandomPoolSize(): number
    {
        const sizes: number[] = [4, 8, 12, 16];
        const randIdx: number = Random.range( 0, sizes.length );

        return sizes[randIdx];
    }

    private testPoolReplacement( genrePool: GenrePool ): void
    {
        for ( let genre of genrePool.getGenreObservables() )
        {
            genre.changed.subscribe( this.onGenrePoolChanged );
        }

        const maxReplacements: number = Math.min( genrePool.count, genrePool.unusedGenreCount );
        let replacementTestCount: number = Random.range( 2, maxReplacements + 1 );
        replacementTestCount = Math.min( genrePool.unusedGenreCount, replacementTestCount );
        console.warn( `Replacing ${replacementTestCount} genres.` );

        const randIndices: number[] = ArrayUtil.createRange( genrePool.count );
        ArrayUtil.fisherYatesShuffle( randIndices );

        for ( let idx: number = 0; idx < replacementTestCount; ++idx )
        {
            const randIdx: number = randIndices[idx];
            genrePool.replaceGenre( randIdx );
        }

        for ( let genre of genrePool.getGenreObservables() )
        {
            genre.changed.unsubscribe( this.onGenrePoolChanged );
        }
    }

    private onGenrePoolChanged( sender: GenrePool, changeArgs: DeltaArgs<GenreModel> ): void
    {
        console.log( `Genre Changed: (${changeArgs.prev}) --> (${changeArgs.current})` );
    }
    //#endregion

    //#region GenreCombiner
    private testCombinerInitialization( genres: GenreModel[] ): GenreCombiner
    {
        const genreCombiner: GenreCombiner = new GenreCombiner( genres );
        console.warn( `GenreCombiner created from ${genres.length} genres into ${genreCombiner.count} combos.` );

        return genreCombiner;
    }

    private testCombinerSwapping( genreCombiner: GenreCombiner ): void
    {
        const slotIndices: number[] = ArrayUtil.createRange( genreCombiner.count );
        ArrayUtil.fisherYatesShuffle( slotIndices );

        let swapCount: number = Random.range( 2, genreCombiner.count + 1 );
        if ( swapCount % 2 !== 0 )
        {
            swapCount = swapCount - 1;
        }

        console.warn( `Prepping ${swapCount} combos for swaps.` );

        const queuedSwapSlots: number[] = new Array( swapCount );

        for ( let idx: number = 0; idx < swapCount; ++idx )
        {
            const randSlot: number = slotIndices[idx];
            const comboModel: GenreComboModel = genreCombiner.getGenreCombo( randSlot );
            const randGenreSlot: number = Random.range( 0, comboModel.combo.length );

            console.log( `Queueing ${comboModel} @ ${comboModel.combo[randGenreSlot].item} for swap.` );
            genreCombiner.queueGenreForSwap( randSlot, randGenreSlot );

            queuedSwapSlots[idx] = randSlot;
        }

        ArrayUtil.fisherYatesShuffle( queuedSwapSlots );

        swapCount /= 2;
        console.warn( `Finalizing ${swapCount} swaps between ...` );

        for ( let idx: number = 0; idx < swapCount; ++idx )
        {
            const lhsSlotIdx: number = queuedSwapSlots[idx * 2];
            const lhsCombo: GenreComboModel = genreCombiner.getGenreCombo( lhsSlotIdx );
            const lhsQueuedGenre: GenreModel = lhsCombo.combo[lhsCombo.queuedSwapSlot].item;

            const rhsSlotIdx: number = queuedSwapSlots[( idx * 2 ) + 1];
            const rhsCombo: GenreComboModel = genreCombiner.getGenreCombo( rhsSlotIdx );
            const rhsQueuedGenre: GenreModel = rhsCombo.combo[rhsCombo.queuedSwapSlot].item;
            
            console.log( `[${lhsCombo} @ ${lhsQueuedGenre}] & [${rhsCombo} @ ${rhsQueuedGenre}]` );
            genreCombiner.swapGenres( lhsSlotIdx, rhsSlotIdx );
        }

        swapCount *= 2;
        console.warn( `${swapCount} swap(s) completed!` );

        for ( let idx: number = 0; idx < swapCount; ++idx )
        {
            const slotIdx: number = queuedSwapSlots[idx];
            const combo: GenreComboModel = genreCombiner.getGenreCombo( slotIdx );

            console.log( `[${combo}]` );
        }
    }
    //#endregion

    //#region BattleAssigner
    private testBattleAssignerInitialization( combos: GenreComboModel[] ): BattleAssigner
    {
        const battleAssigner: BattleAssigner = new BattleAssigner( combos );
        console.warn( `BattleAssigner created with ${battleAssigner.remainingPoints.item} point(s) & ${combos.length} combos.` );

        return battleAssigner;
    }

    private testBattlePointAdding( battleAssigner: BattleAssigner ): void
    {
        for ( let combo of battleAssigner.getGenreCombos() )
        {
            combo.battlePointsChanged.subscribe( this.onBattlePointsChanged );
        }

        let battlePointAllotment: number = battleAssigner.remainingPoints.item;

        console.warn( `Adding ${battlePointAllotment} point(s) ...` );

        while ( battlePointAllotment > 0 )
        {
            const comboIdx: number = Random.range( 0, battleAssigner.comboCount );
            battleAssigner.addBattlePoint( comboIdx );

            battlePointAllotment = battleAssigner.remainingPoints.item;
        }

        for ( let combo of battleAssigner.getGenreCombos() )
        {
            combo.battlePointsChanged.unsubscribe( this.onBattlePointsChanged );
        }
    }

    private onBattlePointsChanged( sender: GenreComboModel, changeArgs: DeltaArgs<number>): void
    {
        console.log( `Added battle points @ ${sender}: (${changeArgs.prev}) --> (${changeArgs.current})` );
    }
    //#endregion

    //#region BattleBracket
    private testBattleBracketInitialization( genreCombos: GenreComboModel[] ): BattleBracket
    {
        const battleBracket: BattleBracket = new BattleBracket( genreCombos );
        console.warn( `BattleBracket created from ${genreCombos.length} combos.` );

        return battleBracket;
    }

    private testBattling( battleBracket: BattleBracket ): void
    {
        console.warn( `Resolving ${battleBracket.getTotalBattleCount()} battles.` );

        while ( !battleBracket.isEmpty )
        {
            const battleResult: BattleResult = battleBracket.resolveNextBattle();
            console.log( `[${battleResult.lhsCombo}]  -VS-  [${battleResult.rhsCombo}]` );

            for ( let idx: number = 0; idx < battleResult.rounds.length; ++idx )
            {
                const round: BattleRound = battleResult.rounds[idx];
                console.log( `\tLHS Die: ${round.lhsDiceRolls}` );
                console.log( `\tRHS Die: ${round.rhsDiceRolls}` );

                if ( idx + 1 < battleResult.rounds.length )
                {
                    console.log( "\t." );
                }
            }

            console.log( `Winner: [${battleResult.winner}]` );
        }
    }
    //#endregion
}

export const integrationTests: IntegrationTests = new IntegrationTests();