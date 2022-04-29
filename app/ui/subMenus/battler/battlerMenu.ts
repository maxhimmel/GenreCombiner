import html from "bundle-text:../../../../assets/html/battler/battlerContainer.html";

import { HtmlTemplateBuilder } from "../../../utility/htmlTemplateBuilder";
import { Observable } from "../../../utility/observable";
import { SubMenu } from "../../iSubMenu";
import { BattleResult, BattleRound } from "../../../battle/battleResolver";
import { BattleComboItem } from "./battleComboItem";
import { DiceMenu } from "./dice/diceMenu";
import { GenreComboModel } from "../../../genre/genreComboModel";
import { BattlerPoolMenu } from "./pool/battlerPoolMenu";
import { IEvent } from "../../../utility/events/iEvent";
import { AsyncUtil } from "../../../utility/async";

export class BattlerMenu extends SubMenu
{
    private readonly ROUND_END_DELAY: number = 0.5;
    
    get allotment(): Observable<number> | null
    {
        return null;
    }
    get title(): string
    {
        return "Battle";
    }
    get description(): string
    {
        return "May the best combo win!";
    }

    get battleStartClicked(): IEvent<void>
    {
        return this._diceMenu.battleStartClicked;
    }

    private _lhsContainer: HTMLElement | null = null;
    private _rhsContainer: HTMLElement | null = null;
    private _lhsComboItem: BattleComboItem | null = null;
    private _rhsComboItem: BattleComboItem | null = null;

    private readonly _diceMenu: DiceMenu;
    private readonly _poolMenu: BattlerPoolMenu;

    constructor( container: HTMLElement, combos: GenreComboModel[] )
    {
        super( container );

        new HtmlTemplateBuilder( html )
            .config( this.config )
            .build( container );
        
        this._diceMenu = new DiceMenu( container );
        this._poolMenu = new BattlerPoolMenu( container, combos );
    }

    private config = async ( root: HTMLElement ): Promise<void> =>
    {
        this._lhsContainer = root.querySelector( "#lhsBattler" );
        this._lhsComboItem = new BattleComboItem( this._lhsContainer as HTMLElement );

        this._rhsContainer = root.querySelector( "#rhsBattler" );
        this._rhsComboItem = new BattleComboItem( this._rhsContainer as HTMLElement );
    }

    async initializeBattle( battle: BattleResult ): Promise<void>
    {
        this._lhsComboItem?.update( battle.lhsCombo );
        this._rhsComboItem?.update( battle.rhsCombo );

        this._poolMenu.setBattlers( battle.lhsCombo, battle.rhsCombo, true );

        this._diceMenu.initializeBattle( battle );
    }

    async updateRound( round: BattleRound )
    {
        await this._diceMenu.update( round );

        const winningSide = round.getWinningSide();
        if ( winningSide === 0 )
        {
            // Tied!
            return;
        }

        let roundWinner: BattleComboItem | null = winningSide < 0 ? this._lhsComboItem : this._rhsComboItem;
        let roundLoser: BattleComboItem | null = winningSide < 0 ? this._rhsComboItem : this._lhsComboItem;

        roundWinner?.playWinAnimation( winningSide );
        await roundLoser?.playLoseAnimation( winningSide * -1 );

        await AsyncUtil.delay( this.ROUND_END_DELAY );
    }

    nextRound(): void
    {
        this._diceMenu.nextRound();
    }

    async updateBattleEnd( battle: BattleResult ): Promise<void>
    {
        this._poolMenu.setBattlers( battle.lhsCombo, battle.rhsCombo, false );
        this._poolMenu.setLoser( battle.loser );

        await this._diceMenu.battleEnd();
    }
}