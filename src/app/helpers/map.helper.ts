import * as d3 from 'd3';
import { IMapData, IMapDataElement } from '../interfaces/chart.interfaces';

export class MapHelper {

    fullDataSet: IMapDataElement[] = [];

    dataByDate = new Map<number, IMapDataElement[]>();

    currentDate = 0;

    datesRange: [number, number];

    data: IMapData = {
        title: 'Covid-19 new death cases',
        data: [],
        thresholds: []
    };

    parseDate = (date: string): number => Date.parse(date);

    timeFormat = d3.timeFormat('%Y-%m-%d');

    setData(data, countryCodes, dataAttr = 'new_deaths_smoothed_per_million') {
        const ids = new Map(countryCodes.map((code) => [code.location, code.iso3]));
       
        this.fullDataSet = data.location.map((location, i) => ({
            id: ids.get(location),
            value: data[dataAttr][i],
            date: this.parseDate(data.date[i])
        }));

        this.dataByDate = d3.group(this.fullDataSet, (d) => d.date);
        
        this.datesRange = d3.extent(this.fullDataSet, (d) => d.date);
        this.setMapData(this.datesRange[1])

        console.log(this);
        
    }

    setMapData = (date: number) => {
        this.currentDate = date;
        
        this.data = {
            title: `Covid-19 new death cases (${this.timeFormat(this.currentDate)})`,
            data: this.dataByDate.get(this.currentDate),
            thresholds: [0.1, 0.2, 0.5, 1, 2, 5, 10, 20]
        };
    }
}