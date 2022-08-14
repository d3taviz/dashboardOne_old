import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as d3 from 'd3';
import ObjectHelper from 'src/app/helpers/object.helper';
import { IMapConfig, IMapData } from 'src/app/interfaces/chart.interfaces';
import { DimensionsService } from 'src/app/services/dimensions.service';

@Component({
  selector: 'app-chart8',
  template: `<svg class="chart8"></svg>`,
  styleUrls: ['./chart8.component.scss'],
  providers: [DimensionsService]
})
export class Chart8Component implements OnInit {

  host: any;
  svg: any;

  containers: any = {};
  title: any;

  projection: any;
  path: any;

  private _geodata: any;

  private _data: IMapData;

  private _config: IMapConfig;

  private _defaultConfig: IMapConfig = {
    margins: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }

  @Input() set geodata(values) {
    this._geodata = values;
  }

  @Input() set data(values) {
    this._data = values;
  }

  @Input() set config(values) {
    this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, values);
  }

  @Output() tooltip = new EventEmitter<any>();

  get geodata() {
    return this._geodata;
  }

  get data() {
    return this._data;
  }

  get config() {
    return this._config || this._defaultConfig;
  }


  constructor(element: ElementRef, public dimensions: DimensionsService) {
    this.host = d3.select(element.nativeElement);
    console.log(this);
    
   }

  ngOnInit(): void {
    this.setSvg();
    this.setDimensions();
    this.setElements();
    this.positioningElements();
    this.setParams();
  }

  setSvg() {
    this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
  }

  setDimensions() {
    const dimensions = this.svg.node().getBoundingClientRect();
    this.dimensions.setDimensions(dimensions);
    this.dimensions.setMargins(this.config.margins);
  }

  setElements() {
    this.containers.countries = this.svg.append('g').attr('class', 'countries');
    this.containers.data = this.svg.append('g').attr('class', 'data');
    this.containers.titleContainer = this.svg.append('g').attr('class', 'title');
    this.title = this.containers.titleContainer.append('text').attr('class', 'title');
    this.containers.legend = this.svg.append('g').attr('class', 'legend');
  }

  positioningElements() {
    this.containers.countries.attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
    this.containers.data.attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
    this.containers.titleContainer.attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);
    this.containers.legend.attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginBottom})`);
  }

  setParams() {
    this.setProjection();
    this.setPath();
    this.setFeatures();
  }

  setProjection() {
    this.projection = d3.geoEquirectangular();
  }

  setPath() {
    this.path = d3.geoPath(this.projection);
  }

  setFeatures(){}

}
