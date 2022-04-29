import { appController } from "./appController";
import { PoolSizeController } from "./ui/subMenus/poolSize/poolSizeController";


window.addEventListener( "DOMContentLoaded", main );

async function main(): Promise<void>
{
    appController.start( new PoolSizeController() );
}