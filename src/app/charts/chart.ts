import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Selection } from 'd3-selection';
import * as d3 from 'd3';
import { debounceTime, fromEvent, Subscription, map } from "rxjs";
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

    private subscriptions: Subscription[] = [];

    chartIsInitialized: boolean = false;
    dataIsInitialized: boolean = false;

    scales: any = {};

    protected abstract _defaultConfig: C;

    // methods
    ngOnInit(): void {
        this.setSubscriptions();

        this.setSvg();
        this.setElements();
        this.chartIsInitialized = true;
        this.updateChart();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    updateChart() {
        this.setDimensions();
        this.positionElements();
        this.setParams();
        this.setLabels();
        this.setLegend();
        this.draw();
      }

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
    subscribe(sub: Subscription): void {
        this.subscriptions.push(sub);
    }

    unsubscribeAll(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
    }

    setSubscriptions(): void {
        this.setResize();
    }

    setResize(): void {
        const resize$ = fromEvent(window, 'resize');

        const subs = resize$
        .pipe(
            map((event: any) => event),
            debounceTime(500)
        )
        .subscribe(() => this.updateChart());

        this.subscribe(subs);
    }


    // set data and config
    abstract onSetData: () => void
    abstract onSetConfig: () => void {}



}