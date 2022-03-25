export class HtmlTemplateBuilder
{
    private static readonly STRIPPER_CLASS_NAME: string = "strip-container";

    private readonly _html: string;
    private _configFn: ( ( element: HTMLElement ) => void ) | null;

    constructor( html: string )
    {
        this._html = html;
        this._configFn = null;
    }

    config( fn: ( element: HTMLElement ) => void ): HtmlTemplateBuilder
    {
        this._configFn = fn;
        return this;
    }

    instant(): HTMLElement
    {
        return this.createHtml();
    }

    build( parent: HTMLElement ): void
    {
        const element = this.createHtml();
        
        if ( this._configFn !== null )
        {
            this._configFn( element );
        }

        this.finalize( parent, element );
    }

    private createHtml(): HTMLElement
    {
        const template = document.createElement( "template" );
        template.innerHTML = this._html.trim();

        return template.content.firstChild as HTMLElement;
    }

    private finalize( parent: HTMLElement, newElement: HTMLElement ): void
    {
        if ( !newElement.classList.contains( HtmlTemplateBuilder.STRIPPER_CLASS_NAME ) )
        {
            parent.appendChild( newElement );
            return;
        }

        while ( newElement.firstElementChild !== null )
        {
            parent.appendChild( newElement.firstElementChild as Element );
        }
        newElement.remove();
    }
}