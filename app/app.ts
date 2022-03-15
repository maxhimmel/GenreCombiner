import { GenrePool } from "./genre/genrePool";
import { GenreCombiner } from "./genre/genreCombiner";
import { GenreModel } from "./genre/genreModel";
import { IteratorUtil } from "./utility/iterators";
import { BattleAssigner } from "./battle/battleAssigner";
import { GenreComboModel } from "./genre/genreComboModel";
import { BattleBracket } from "./battle/battleBracket";

/*--*/

/* Genre Pool: */
const genrePool = new GenrePool();
genrePool.init( 4 );
console.log( genrePool );

/* Genre Combiner: */
const fooGenre = new GenreModel( 1, "Foo" );
const barGenre = new GenreModel( 2, "Bar" );
const tinyGenre = new GenreModel( 3, "Tiny" );
const largeGenre = new GenreModel( 4, "Large" );
const tigerGenre = new GenreModel( 5, "Tiger" );
const rabbitGenre = new GenreModel( 6, "Rabbit" );
const fireGenre = new GenreModel( 7, "Fire" );
const waterGenre = new GenreModel( 8, "Water" );
const genres = [fooGenre, barGenre, tinyGenre, largeGenre, tigerGenre, rabbitGenre, fireGenre, waterGenre];
const genreCombiner = new GenreCombiner( genres );

console.log( genreCombiner );

genreCombiner.queueGenreForSwap( 0, 0 );
genreCombiner.queueGenreForSwap( 1, 1 );
genreCombiner.swapGenres( 0, 1 );

/* Battle Assigner: */
const battleAssigner = new BattleAssigner( 6, genreCombiner.genreCombos );

console.log( battleAssigner );

const iter = battleAssigner.getGenreCombos();
IteratorUtil.forEach( iter, ( combo: GenreComboModel ) =>
{
    combo.battlePointsChanged.subscribe( ( sender, deltaArgs ) =>
    {
        console.warn( `${sender}: (${deltaArgs.prev}) --> (${deltaArgs.current})` );
    } );
} );

// Exhaust allocated battle points ...
battleAssigner.addBattlePoint( 0 );
battleAssigner.addBattlePoint( 0 );
battleAssigner.addBattlePoint( 1 );
// Expect an error adding non-existant point ...
battleAssigner.addBattlePoint( 0 );
// Successfully remove a point ...
battleAssigner.removeBattlePoint( 1 );
battleAssigner.addBattlePoint( 1 );
battleAssigner.addBattlePoint( 1 );
battleAssigner.addBattlePoint( 1 );

/* Battle Bracket: */
const battleBracket = new BattleBracket( genreCombiner.genreCombos );
console.log( battleBracket );

while ( !battleBracket.isEmpty )
{
    const result = battleBracket.resolveNextBattle();
    console.log( result );
}