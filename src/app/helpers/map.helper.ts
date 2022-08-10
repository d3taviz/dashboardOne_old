import * as d3 from 'd3';

export class MapHelper {

    fullDataSet = [];

    dataByDate = new Map<number, any>();

    currentDate = 0;

    datesRange: [number, number];

    data: any;

    parseDate = (date: string): number => Date.parse(date);

    timeFormat = (date: number) => d3.timeFormat('%Y-%m-%d')(date);

    setData(data, countryCodes, dataAttr = 'new_deaths_smoothed_per_million') {
        const ids = new Map(countryCodes.map((code) => [code.location, code.iso3]));
       
        this.fullDataSet = data.location.map((location, i) => ({
            id: ids.get(location),
            value: data[dataAttr][i],
            date: this.parseDate(data.date[i])
        }));

        this.dataByDate = d3.group(this.fullDataSet, (d) => d.date);
        
        this.datesRange = d3.extent(this.fullDataSet, (d) => d.date);

        this.currentDate = this.datesRange[1];

        this.data = {
            title: `Covid-19 new death cases (${this.timeFormat(this.currentDate)})`,
            data: this.dataByDate.get(this.currentDate)
        }

        console.log(this);
        
    }
}