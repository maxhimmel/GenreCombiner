import { diceFactory } from "./diceFactory";

export class DiceItem
{
    private _side: HTMLElement | null = null;

    constructor( side: number, parent: HTMLElement )
    {
        diceFactory.create( side, parent, this.config );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._side = root.querySelector( ".side" ) as HTMLElement;
    }

    playWinAnimation(): void
    {
        this._side?.classList.add( "dice-win" );
    }

    playLoseAnimation(): void
    {
        this._side?.classList.add( "dice-lose" );
    }

    playTieAnimation(): void
    {
        this._side?.classList.add( "dice-tie" );
    }
}