export interface ISubMenu
{
    get title(): string;
    get description(): string;

    attach( parent: HTMLElement ): void;
    remove(): void;
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
    
    attach( parent: HTMLElement ): void
    {
        throw new Error( "Method not implemented." );
    }

    remove(): void
    {
        throw new Error( "Method not implemented." );
    }
}

export const emptySubMenu: EmptySubMenu = new EmptySubMenu();