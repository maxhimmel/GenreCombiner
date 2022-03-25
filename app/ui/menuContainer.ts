import { AnimUtil } from "../utility/animations";
import { EventHandler } from "../utility/events/eventHandler";
import { IEvent } from "../utility/events/iEvent";
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
        this.cacheElements( root as HTMLElement );

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

    async pushSubMenu( subMenu: ISubMenu ): Promise<void>
    {
        if ( this._isAnimatingSubMenu )
        {
            throw new Error( `Cannot push '${subMenu}' while animating fade-dropping.` );
        }

        this._isAnimatingSubMenu = true;
        this.setContinueActive( false );

        await this.tryHideAndRemoveActiveSubMenu();
        await this.addAndShowNewSubMenu( subMenu );

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
            this._currentSubMenu.remove();
        }
    }

    private isSubMenuActive(): boolean
    {
        return this._currentSubMenu !== emptySubMenu;
    }

    private async addAndShowNewSubMenu( newSubMenu: ISubMenu ): Promise<void>
    {
        this._currentSubMenu = newSubMenu;

        const subContainer = this.getElement( MenuContainer.ElementID.Sub );
        newSubMenu.attach( subContainer );

        const title = this.getElement( MenuContainer.ElementID.Title );
        title.childNodes[0].textContent = newSubMenu.title;

        const description = this.getElement( MenuContainer.ElementID.Description );
        description.innerText = newSubMenu.description;

        await this.toggleSubMenuCollapse();
    }

    private async toggleSubMenuCollapse(): Promise<void>
    {
        const fadeDropper = this.getElement( MenuContainer.ElementID.FadeDropper );
        await AnimUtil.toggleFadeDrop( fadeDropper );
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