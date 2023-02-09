import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Selection } from 'd3-selection';
import * as d3 from 'd3';
import { Subscription } from "rxjs";

@Directive()
export abstract class Chart<D, C> implements OnInit, OnDestroy {
    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    private _data: D = null as any;
    private _config: C = null as any;

    get data() {
        return this._data;
    }

    get config() {
        return this._config;
    }

    @Input() set data(data) {
        this._data = data;
    }

    @Input() set config(config) {
        this._config = config;
    }

    @Output() events = new EventEmitter<any>();


    // elements
    protected host: Selection<any, any, any, any> = null as any;
    protected svg: Selection<SVGSVGElement, any, any, any> = null as any;

    protected subscriptions: Subscription[] = [];

    chartIsInitialized: boolean = false;
    dataIsInitialized: boolean = false;

    scales: any = {};

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
    setData(): void {}
    setConfig(): void {}



}