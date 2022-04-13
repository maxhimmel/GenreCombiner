import html from "bundle-text:../../../../../assets/html/battler/dice/diceContainer.html"

import { HtmlTemplateBuilder } from "../../../../utility/htmlTemplateBuilder"
import { DiceContainer } from "./diceContainer";
import { BattleRound } from "../../../../battle/battleResolver";
import { AsyncUtil } from "../../../../utility/async";

export class DiceMenu
{
    private readonly DICE_CONTAINER_COUNT: number = 2;

    private _startRoundButton: HTMLElement | null = null;
    private _diceOverlay: HTMLElement | null = null;
    private _lhsDiceContainer: DiceContainer | null = null;
    private _rhsDiceContainer: DiceContainer | null = null;

    private _canStartRound: boolean = false;

    constructor( parent: HTMLElement )
    {
        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._diceOverlay = root.querySelector( ".dice-fight-overlay" );
        this._startRoundButton = root.querySelector( ".btn-dice-fight" );

        this._startRoundButton?.addEventListener( "click", this.onStartRoundClicked );

        const containers = root.querySelectorAll( ".dice-container" );
        if ( containers.length < this.DICE_CONTAINER_COUNT )
        {
            throw new RangeError();
        }

        this._lhsDiceContainer = new DiceContainer( containers[0] as HTMLElement );
        this._rhsDiceContainer = new DiceContainer( containers[1] as HTMLElement );
    }

    private onStartRoundClicked = (): void =>
    {
        this._canStartRound = true;
    }

    async update( round: BattleRound ): Promise<void>
    {
        this._lhsDiceContainer?.update( round.lhsDiceRolls );
        this._rhsDiceContainer?.update( round.rhsDiceRolls );

        await AsyncUtil.until( () => this._canStartRound );
        this._canStartRound = false;

        if ( this._diceOverlay !== null )
        {
            let isOverlayHidden = false;
            const onOverlayHidden = (): void =>
            {
                isOverlayHidden = true;
                this._diceOverlay?.removeEventListener( "transitionend", onOverlayHidden );
            };
            this._diceOverlay.addEventListener( "transitionend", onOverlayHidden );

            this._diceOverlay.style.transform = "translateY(-100%)";

            await AsyncUtil.until( () => isOverlayHidden );
        }

        for ( let idx: number = 0; idx < round.winners.length; ++idx )
        {
            await AsyncUtil.delay( 1 );

            const winningSide = round.winners[idx];
            if ( winningSide !== 0 )
            {
                this._lhsDiceContainer?.setWinAnimation( idx, winningSide < 0 );
                this._rhsDiceContainer?.setWinAnimation( idx, winningSide > 0 );
            }
            else
            {
                this._lhsDiceContainer?.setTieAnimation( idx );
                this._rhsDiceContainer?.setTieAnimation( idx );
            }
        }

        if ( this._diceOverlay !== null )
        {
            let isOverlayShown = false;
            const onOverlayShown = (): void =>
            {
                isOverlayShown = true;
                this._diceOverlay?.removeEventListener( "transitionend", onOverlayShown );
            };
            this._diceOverlay.addEventListener( "transitionend", onOverlayShown );

            this._diceOverlay.style.removeProperty( "transform" );

            await AsyncUtil.until( () => isOverlayShown );
        }
    }
}