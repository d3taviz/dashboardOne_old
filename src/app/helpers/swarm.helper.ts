import { ISwarmData } from "../interfaces/chart.interfaces";

export class SwarmHelper {
    data: ISwarmData = { title: '', unit: '', data: [] };

    setData(
        data: any,
        title: string,
        category: string,
        id: string,
        label: string,
        value: string,
        group: string,
        unit: string,
        decimals?: number
    ) {
        
        return {
            title,
            unit,
            data: []
        };
    }
}