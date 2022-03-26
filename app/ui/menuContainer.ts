import { AnimUtil } from "../utility/animations";
import { EventHandler } from "../utility/events/eventHandler";
import { IEvent } from "../utility/events/iEvent";
import { DeltaArgs } from "../utility/observable";
import { ISubMenu, emptySubMenu } from "./iSubMenu";

export class MenuContainer
{
    get continueClicked(): IEvent<void>
    {
        return this._continueClicked;
    }

    private readonly _elementMap: Map<string, HTMLElement>;
    private readonly _continueClicked: EventHandler<void>;

    private _isAnimatingSubMenu: boolean;
    private _currentSubMenu: ISubMenu;

    constructor()
    {
        this._elementMap = new Map();
        this._continueClicked = new EventHandler();

        this._isAnimatingSubMenu = false;
        this._currentSubMenu = emptySubMenu;

        const root = document.querySelector( `#${MenuContainer.ElementID.Root}` ) as HTMLElement;
        this.cacheElements( root );

        const continueElement = this.getElement( MenuContainer.ElementID.Continue );
        continueElement.addEventListener( "click", this.onContinueClicked );
    }

    private cacheElements( root: HTMLElement ): void
    {
        this._elementMap.set( MenuContainer.ElementID.Root, root );

        const ids = Object.values( MenuContainer.ElementID );
        for ( let idx: number = 0; idx < ids.length; ++idx  )
        {
            const id = ids[idx];
            const element = root.querySelector( `#${id}` );
            if ( element === null )
            {
                continue;
            }

            this._elementMap.set( id, element as HTMLElement );
        }
    }

    private onContinueClicked = () =>
    {
        this._continueClicked.invoke( this );
    }

    async pushSubMenu( subMenuReqest: SubMenuRequest ): Promise<void>
    {
        if ( this._isAnimatingSubMenu )
        {
            throw new Error( `Cannot push new sub menu while animating fade-dropping.` );
        }

        this._isAnimatingSubMenu = true;
        this.setContinueActive( false );

        await this.tryHideAndRemoveActiveSubMenu();
        await this.addAndShowNewSubMenu( subMenuReqest );

        this.setContinueActive( true );
        this._isAnimatingSubMenu = false;
    }

    private setContinueActive( isActive: boolean ): void
    {
        const continueElement = this.getElement( MenuContainer.ElementID.Continue ) as HTMLInputElement;
        continueElement.disabled = !isActive;
    }

    private async tryHideAndRemoveActiveSubMenu(): Promise<void>
    {
        if ( this.isSubMenuActive() )
        {
            await this.toggleSubMenuCollapse();

            this.tryListenForAllotmentChanges( this._currentSubMenu, false );
            this.removeSubMenu();
        }
    }

    private isSubMenuActive(): boolean
    {
        return this._currentSubMenu !== emptySubMenu;
    }

    private async toggleSubMenuCollapse(): Promise<void>
    {
        const fadeDropper = this.getElement( MenuContainer.ElementID.FadeDropper );
        await AnimUtil.toggleFadeDrop( fadeDropper );
    }

    private removeSubMenu(): void
    {
        const subMenuContainer = this.getElement( MenuContainer.ElementID.Sub );
        while ( subMenuContainer.firstElementChild !== null )
        {
            subMenuContainer.lastElementChild?.remove();
        }
    }

    private async addAndShowNewSubMenu( subMenuRequest: SubMenuRequest ): Promise<void>
    {
        const subContainer = this.getElement( MenuContainer.ElementID.Sub );
        const newSubMenu = subMenuRequest.create( subContainer );
        this._currentSubMenu = newSubMenu;

        this.setElementText( MenuContainer.ElementID.Title, newSubMenu.title );
        this.setElementText( MenuContainer.ElementID.Description, newSubMenu.description );
        this.tryListenForAllotmentChanges( newSubMenu, true );

        await this.toggleSubMenuCollapse();
    }

    private tryListenForAllotmentChanges( subMenu: ISubMenu, isListening: boolean ): boolean
    {
        if ( subMenu.allotment === null )
        {
            return false;
        }

        if ( isListening )
        {
            subMenu.allotment.changed.subscribe( this.onSubMenuAllotmentChanged );
        }
        else
        {
            subMenu.allotment.changed.unsubscribe( this.onSubMenuAllotmentChanged );
        }

        this.setElementText( MenuContainer.ElementID.Allotment, subMenu.allotment.item.toString() );
        this.setElementVisible( MenuContainer.ElementID.Allotment, isListening );

        return true;
    }

    private onSubMenuAllotmentChanged = ( sender: any, changedArgs: DeltaArgs<number> ): void =>
    {
        this.setElementText( MenuContainer.ElementID.Allotment, changedArgs.current.toString() );
    }

    private setElementText( id: MenuContainer.ElementID, text: string ): void
    {
        const element = this.getElement( id );
        element.childNodes[0].textContent = text;
    }

    private setElementVisible( id: MenuContainer.ElementID, isVisible: boolean ): void
    {
        const element = this.getElement( id );

        if ( isVisible )
        {
            element.classList.remove( "d-none" );
        }
        else
        {
            element.classList.add( "d-none" );
        }
    }

    private getElement( id: MenuContainer.ElementID ): HTMLElement
    {
        if ( !this._elementMap.has( id ) )
        {
            throw new ReferenceError( `No element exists w/ID: ${id}` );
        }

        return this._elementMap.get( id ) as HTMLElement;
    }
}

export namespace MenuContainer
{
    export enum ElementID
    {
        Root = "mainContainer",
        Sub = "subContainer",
        Title = "title",
        Description = "description",
        FadeDropper = "fadeDropper",
        Continue = "continue",
        Allotment = "badgeAllotment"
    }
}

export class SubMenuRequest
{
    private readonly _createFn: ( root: HTMLElement ) => ISubMenu;

    constructor( createFn: ( root: HTMLElement ) => ISubMenu  )
    {
        this._createFn = createFn;
    }

    create( root: HTMLElement ): ISubMenu
    {
        return this._createFn( root );
    }
}