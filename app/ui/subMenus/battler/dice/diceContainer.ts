import { DiceItem } from "./diceItem";

export class DiceContainer
{
    private _diceItems: DiceItem[] = [];
    private _container: HTMLElement;

    constructor( root: HTMLElement )
    {
        this._container = root;
    }

    update( diceRolls: number[] ): void
    {
        this.clear();

        this._diceItems = new Array( diceRolls.length );
        for ( let idx: number = 0; idx < diceRolls.length; ++idx )
        {
            const roll = diceRolls[idx];
            const item = new DiceItem( roll, this._container );

            this._diceItems[idx] = item;
        }
    }

    clear(): void
    {
        while ( this._container.firstChild !== null )
        {
            if ( this._container.lastChild !== null )
            {
                this._container.lastChild.remove();
            }
        }
    }

    setWinAnimation( diceIndex: number, isWinner: boolean ): void
    {
        if ( diceIndex < 0 || diceIndex >= this._diceItems.length )
        {
            throw new RangeError();
        }

        const item = this._diceItems[diceIndex];
        
        isWinner
            ? item.playWinAnimation()
            : item.playLoseAnimation();
    }

    setTieAnimation( diceIndex: number ): void
    {
        if ( diceIndex < 0 || diceIndex >= this._diceItems.length )
        {
            throw new RangeError();
        }

        const item = this._diceItems[diceIndex];
        item.playTieAnimation();
    }
}