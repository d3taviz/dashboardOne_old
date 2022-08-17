import * as d3 from 'd3';
import { MapTooltipActions, MapTooltipActionsTypes, ShowMapTooltip } from '../actions/map-tooltip.actions';
import { IMapData, IMapDataElement, ITimelineData, ITooltipState } from '../interfaces/chart.interfaces';

export class MapHelper {

    fullDataSet: IMapDataElement[] = [];

    dataByDate = new Map<number, IMapDataElement[]>();
    dataByCountry = new Map<string, IMapDataElement[]>();

    countriesById = new Map<string, string>();

    currentDate = 0;

    datesRange: [number, number];

    data: IMapData = {
        title: 'Covid-19 new death cases',
        data: [],
        thresholds: []
    };

    tooltipState: ITooltipState = {
        visible: false,
        x: 0,
        y: 0
    };

    tooltipData: ITimelineData = {
        title: '',
        activeTime: null,
        data: [],
        timeFormat: ''
    };

    parseDate = (date: string): number => Date.parse(date);

    timeFormatTemplate = '%Y-%m-%d';

    timeFormat = d3.timeFormat(this.timeFormatTemplate);

    setData(data, countryCodes, dataAttr = 'new_deaths_smoothed_per_million') {
        const ids = new Map(countryCodes.map((code) => [code.location, code.iso3]));

        this.countriesById = new Map(countryCodes.map((code) => [code.iso3, code.location]));
       
        this.fullDataSet = data.location.map((location, i) => ({
            id: ids.get(location),
            value: data[dataAttr][i],
            date: this.parseDate(data.date[i])
        }));

        this.dataByDate = d3.group(this.fullDataSet, (d) => d.date);
        this.dataByCountry = d3.group(this.fullDataSet, (d) => d.id);
        
        this.datesRange = d3.extent(this.fullDataSet, (d) => d.date);
        this.setMapData(this.datesRange[1])

        console.log(this);
        
    }

    setMapData = (date: number) => {
        this.currentDate = date;
        
        this.data = {
            title: `Covid-19 new death cases (${this.timeFormat(this.currentDate)})`,
            data: this.dataByDate.get(this.currentDate),
            thresholds: [null, 0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20]
        };
    }

    tooltip = (action : MapTooltipActions) => {
        switch(action.type) {
            case MapTooltipActionsTypes.showTooltip:
                this.showTooltip(action);
                break;
            case MapTooltipActionsTypes.hideTooltip:
                this.hideTooltip();
                break;
        }
        
    }

    setTooltipData(id: string) {
        this.tooltipData = {
            title: this.countriesById.get(id),
            data: this.dataByCountry.get(id),
            activeTime: this.currentDate,
            timeFormat: this.timeFormatTemplate
        };
    }

    showTooltip(action: ShowMapTooltip) {
        // set position
        // set visible to true
        this.tooltipState = {
            visible: true,
            x: action.payload.x,
            y: action.payload.y
        };
        // set the data
        this.setTooltipData(action.payload.id);
    }

    hideTooltip() {
        this.tooltipState = {
            visible: false,
            x: 0,
            y: 0
        };
        // set the position
        // set visible to false
    }
}