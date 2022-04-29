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
        this.playAnimation( "dice-win" );
    }

    playLoseAnimation(): void
    {
        this.playAnimation( "dice-lose" );
    }

    playTieAnimation(): void
    {
        this.playAnimation( "dice-tie" );
    }

    private playAnimation( animName: string ): void
    {
        this._side?.classList.remove( "side" );
        this._side?.classList.add( animName );
    }
}