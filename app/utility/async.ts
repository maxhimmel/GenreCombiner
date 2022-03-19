export class AsyncUtil
{
    private constructor() { }

    static async until( conditional: () => boolean ): Promise<void>
    {
        while ( !conditional() )
        {
            await this.delay( 0 );
        }
    }

    static async delay( seconds: number ): Promise<void>
    {
        return new Promise( resolve =>
        {
            setTimeout( resolve, seconds * 1000 );
        } );
    }
}