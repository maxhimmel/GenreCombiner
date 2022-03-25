import { stepData } from "../../assets/data/poolSizeConfig.json"
import { genreDatabase } from "./genreDatabase";

export class PoolSize
{
    get minSize(): number
    {
        return stepData.minSize;
    }

    *getSizes(): Generator<number>
    {
        const step = stepData.step;
        const maxSize = genreDatabase.count;

        for ( let idx: number = this.minSize; idx < maxSize; idx += step )
        {
            yield idx;
        }
    }
}