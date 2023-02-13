import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Selection } from 'd3-selection';
import * as d3 from 'd3';
import { Subscription } from "rxjs";
import { IBaseConfig } from "../interfaces/chart.interfaces";
import { DimensionsService } from "../services/dimensions.service";
import { ObjectHelper } from '../helpers/object.helper';

@Directive()
export abstract class Chart<D, C extends IBaseConfig> implements OnInit, OnDestroy {
    constructor(element: ElementRef, protected dimensions: DimensionsService) {
        this.host = d3.select(element.nativeElement);
    }

    private _data: D = null as any;
    private _config: C = null as any;

    get data() {
        return this._data;
    }

    get config() {
        return this._config || this._defaultConfig;
      }

    @Input() set data(data) {
        this._data = data;
        this.dataIsInitialized = true;
        this.onSetData();
    }

    @Input() set config(config) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, config);
        this.onSetConfig();
    }

    @Output() events = new EventEmitter<any>();


    // elements
    protected host: Selection<any, any, any, any> = null as any;
    protected svg: Selection<SVGSVGElement, any, any, any> = null as any;

    protected subscriptions: Subscription[] = [];

    chartIsInitialized: boolean = false;
    dataIsInitialized: boolean = false;

    scales: any = {};

    protected abstract _defaultConfig: C;

    // methods
    ngOnInit(): void {}

    ngOnDestroy(): void {
        
    }

    updateChart(): void {}

    // run once
    setSvg(): void {}

    setDimensions(): void {}

    setElements(): void {}


    // run on update chart
    positionElements(): void {}

    setParams(): void {}

    setLabels(): void {}

    setLegend(): void {}

    draw(): void {}


    // subscriptions
    subscribe(sub: Subscription): void {}

    unsubscribeAll(): void {}

    setSubscriptions(): void {}

    setResize(): void {}


    // set data and config
    abstract onSetData: () => void
    abstract onSetConfig: () => void {}



}