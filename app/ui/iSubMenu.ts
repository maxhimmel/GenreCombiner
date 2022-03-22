export interface ISubMenu
{
    get title(): string;
    get description(): string;
    get element(): HTMLElement;
}

class EmptySubMenu implements ISubMenu
{
    get title(): string
    {
        return "Empty";
    }
    get description(): string
    {
        return "Something went wrong.";
    }
    get element(): HTMLElement
    {
        return this._element;
    }

    private readonly _element: HTMLElement;

    constructor()
    {
        this._element = document.createElement( "template" );
    }
}

export const emptySubMenu: EmptySubMenu = new EmptySubMenu();