import html from "bundle-text:../../../../../assets/html/battler/dice/diceContainer.html"
import htmlRoundIndicator from "bundle-text:../../../../../assets/html/battler/dice/diceRoundIndicator.html"
import htmlRound from "bundle-text:../../../../../assets/html/battler/dice/diceRound.html"

import "../../../../utility/extensions";
import { HtmlTemplateBuilder } from "../../../../utility/htmlTemplateBuilder"
import { DiceContainer } from "./diceContainer";
import { BattleResult, BattleRound, GenreSide } from "../../../../battle/battleResolver";
import { AsyncUtil } from "../../../../utility/async";
import { EventHandler } from "../../../../utility/events/eventHandler";
import { IEvent } from "../../../../utility/events/iEvent";

import Carousel from "bootstrap/js/dist/carousel";

export class DiceMenu
{
    private readonly DICE_CONTAINER_COUNT: number = 2;
    private readonly ROUND_START_DELAY: number = 1;
    private readonly DICE_RESOLVE_DURATION: number = 1;

    get battleStartClicked(): IEvent<void>
    {
        return this._battleStartClicked;
    }

    private readonly _battleStartClicked: EventHandler<void>;

    private _startBattleButton: HTMLElement | null = null;
    private _roundCarousel: HTMLElement | null = null;
    private _roundContainer: HTMLElement | null = null;
    private _roundIndicatorContainer: HTMLElement | null = null;
    private _diceOverlay: HTMLElement | null = null;

    private readonly _roundToDiceContainers: Map<BattleRound, Array<DiceContainer>> = new Map();

    constructor( parent: HTMLElement )
    {
        this._battleStartClicked = new EventHandler();

        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( parent );
    }

    private config = ( root: HTMLElement ): void =>
    {
        this._diceOverlay = root.querySelector( ".dice-fight-overlay" ) as HTMLElement;

        this._startBattleButton = this._diceOverlay?.querySelector( ".btn-dice-fight" );
        this._startBattleButton?.addEventListener( "click", this.onStartBattleClicked );

        this._roundCarousel = root.querySelector( "#diceRounds" ) as HTMLElement;
        this._roundIndicatorContainer = this._roundCarousel.querySelector( ".carousel-indicators" );
        this._roundContainer = this._roundCarousel.querySelector( ".carousel-inner" );
    }

    private onStartBattleClicked = (): void =>
    {
        this.setDiceOverlayPositionY( "-100%" );
        this._battleStartClicked.invoke( this );
    }

    initializeBattle( battle: BattleResult ): void
    {
        this.clear();

        for ( let idx: number = 0; idx < battle.rounds.length; ++idx )
        {
            const round = battle.rounds[idx];

            this.addRoundIndicator( idx );
            this.addDiceRound( round );
        }
        
        const firstIndicator = this._roundIndicatorContainer?.firstElementChild;
        firstIndicator?.classList.add( "active" );

        const firstRound = this._roundContainer?.firstElementChild;
        firstRound?.classList.add( "active" );

        this.normalizeRoundHeights();
    }

    private clear(): void
    {
        this._roundIndicatorContainer?.removeAllChildren();
        this._roundContainer?.removeAllChildren();

        this._roundToDiceContainers.clear();
    }

    private addRoundIndicator( index: number ): void
    {
        const indicatorElement = new HtmlTemplateBuilder( htmlRoundIndicator ).instant();
        indicatorElement.setAttribute( "data-bs-slide-to", index.toString() );
        this._roundIndicatorContainer?.appendChild( indicatorElement );
    }

    private addDiceRound( round: BattleRound ): void
    {
        const roundElement = new HtmlTemplateBuilder( htmlRound ).instant();
        const diceContainers = roundElement.querySelectorAll( ".dice-container" );
        if ( diceContainers.length < this.DICE_CONTAINER_COUNT )
        {
            throw new RangeError();
        }

        const lhsDiceContainer = new DiceContainer( diceContainers[0] as HTMLElement );
        lhsDiceContainer.update( round.lhsDiceRolls );
        const rhsDiceContainer = new DiceContainer( diceContainers[1] as HTMLElement );
        rhsDiceContainer.update( round.rhsDiceRolls );

        this._roundToDiceContainers.set( round, [lhsDiceContainer, rhsDiceContainer] );
        this._roundContainer?.appendChild( roundElement );
    }

    private normalizeRoundHeights(): void
    {
        if ( this._roundContainer === null )
        {
            return;
        }

        this._roundContainer.reflow();

        let tallest: number = 0;
        for ( let idx: number = 0; idx < this._roundContainer.children.length; ++idx )
        {
            const round = this._roundContainer.children.item( idx ) as HTMLElement;
            round.reflow();

            const roundHeight = round.scrollHeight;
            if ( roundHeight > tallest )
            {
                tallest = roundHeight;
            }
        }

        for ( let idx: number = 0; idx < this._roundContainer.children.length; ++idx )
        {
            const round = this._roundContainer.children.item( idx ) as HTMLElement;
            round.style.minHeight = `${tallest}px`;
        }
    }

    async update( round: BattleRound ): Promise<void>
    {
        await AsyncUtil.delay( this.ROUND_START_DELAY );

        for ( let idx: number = 0; idx < round.winners.length; ++idx )
        {
            const diceContainers = this._roundToDiceContainers.get( round );
            if ( diceContainers === undefined )
            {
                throw new RangeError();
            }

            const lhsContainer = diceContainers[0];
            const rhsContainer = diceContainers[1];

            const winningSide: GenreSide = round.winners[idx];
            if ( winningSide !== 0 )
            {
                lhsContainer?.setWinAnimation( idx, winningSide < 0 );
                rhsContainer?.setWinAnimation( idx, winningSide > 0 );
            }
            else
            {
                lhsContainer?.setTieAnimation( idx );
                rhsContainer?.setTieAnimation( idx );
            }

            await AsyncUtil.delay( this.DICE_RESOLVE_DURATION );
        }
    }

    nextRound(): void
    {
        const carousel = new Carousel( this._roundCarousel as HTMLElement );
        carousel.next();
    }

    async battleEnd(): Promise<void>
    {
        await this.setDiceOverlayPositionY( "0%" );
    }

    private async setDiceOverlayPositionY( positionY: string ): Promise<void>
    {
        if ( this._diceOverlay === null )
        {
            return;
        }

        this._diceOverlay.style.transform = `translateY(${positionY})`;
        await this._diceOverlay.waitForTransitionEnd();
    }
}