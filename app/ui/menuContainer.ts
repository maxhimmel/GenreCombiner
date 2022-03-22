import { AnimUtil } from "../utility/animations";
import { ISubMenu, emptySubMenu } from "./iSubMenu";

export class MenuContainer
{
    private readonly _elementMap: Map<string, HTMLElement>;

    private _isAnimatingSubMenu: boolean;
    private _currentSubMenu: ISubMenu;

    constructor()
    {
        this._elementMap = new Map();

        this._isAnimatingSubMenu = false;
        this._currentSubMenu = emptySubMenu;

        const root = document.querySelector( `#${MenuContainer.Element.Root}` );
        if ( root === null )
        {
            throw new ReferenceError( `Cannot find element w/ID: ${MenuContainer.Element.Root}` );
        }

        this.cacheElements( root as HTMLElement );
    }

    private cacheElements( root: HTMLElement ): void
    {
        this._elementMap.set( MenuContainer.Element.Root, root );

        const ids = Object.values( MenuContainer.Element );
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

    async pushSubMenu( subMenu: ISubMenu ): Promise<void>
    {
        if ( this._isAnimatingSubMenu )
        {
            throw new Error( `Cannot push '${subMenu}' while animating fade-dropping.` );
        }

        this._isAnimatingSubMenu = true;

        await this.tryHideAndRemoveActiveSubMenu();
        await this.addAndShowNewSubMenu( subMenu );

        this._isAnimatingSubMenu = false;
    }

    private async tryHideAndRemoveActiveSubMenu(): Promise<void>
    {
        if ( this.isSubMenuActive() )
        {
            await this.toggleSubMenuCollapse();
            this._currentSubMenu.element.remove();
        }
    }

    private isSubMenuActive(): boolean
    {
        return this._currentSubMenu !== emptySubMenu;
    }

    private async addAndShowNewSubMenu( newSubMenu: ISubMenu ): Promise<void>
    {
        this._currentSubMenu = newSubMenu;

        const subContainer = this.getElement( MenuContainer.Element.Sub );
        subContainer.appendChild( newSubMenu.element );

        const title = this.getElement( MenuContainer.Element.Title );
        title.childNodes[0].textContent = newSubMenu.title;

        const description = this.getElement( MenuContainer.Element.Description );
        description.innerText = newSubMenu.description;

        await this.toggleSubMenuCollapse();
    }

    private async toggleSubMenuCollapse(): Promise<void>
    {
        const fadeDropper = this.getElement( MenuContainer.Element.FadeDropper );
        await AnimUtil.toggleFadeDrop( fadeDropper );
    }

    private getElement( id: MenuContainer.Element ): HTMLElement
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
    export enum Element
    {
        Root = "mainContainer",
        Sub = "subContainer",
        Title = "title",
        Description = "description",
        FadeDropper = "fadeDropper",
        Continue = "continue"
    }
}