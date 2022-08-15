import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as d3 from 'd3';
import * as topojson from 'topojson';

import ObjectHelper from 'src/app/helpers/object.helper';
import { IMapConfig, IMapData } from 'src/app/interfaces/chart.interfaces';
import { DimensionsService } from 'src/app/services/dimensions.service';

@Component({
  selector: 'app-chart8',
  template: `<svg class="chart8">
    <style>
      .chart8 path.countries {
        fill: #fff;
        stroke: #aaa;
      }

      .chart8 path.data {
        stroke: none;
      }
    </style>
  </svg>`,
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
  features: any;
  dataFeatures: any;

  colors: any;

  private _geodata: any;

  private _data: IMapData;

  private _config: IMapConfig;

  private _defaultConfig: IMapConfig = {
    margins: {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    }
  }

  @Input() set geodata(values) {
    this._geodata = values;
    if (!this.svg) { return; }
    this.updateChart();
  }

  @Input() set data(values) {
    this._data = values;
    if (!this.svg) { return; }
    this.updateChart();
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
    if (!this.geodata) { return; }
    this.updateChart();
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
    this.containers.countries.append('path').attr('class', 'countries');
    this.containers.data = this.svg.append('g').attr('class', 'data');
    this.containers.titleContainer = this.svg.append('g').attr('class', 'title');
    this.title = this.containers.titleContainer.append('text').attr('class', 'title');
    this.containers.legend = this.svg.append('g').attr('class', 'legend');
  }

  updateChart() {
    this.positioningElements();
    this.setParams();
    this.setDataFeatures();
    this.setLabels();
    this.setLegend();
    this.draw();
  }

  positioningElements() {
    this.containers.countries.attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
    this.containers.data.attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
    this.containers.titleContainer.attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);
    this.containers.legend.attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginBottom})`);
  }

  setParams() {
    this.setFeatures();
    this.setProjection();
    this.setPath();
    this.setColors();
  }

  setProjection() {
    this.projection = d3.geoEquirectangular()
      .fitSize([this.dimensions.innerWidth, this.dimensions.innerHeight], this.features);
  }

  setPath() {
    this.path = d3.geoPath(this.projection);
  }

  setColors() {
    this.colors = d3.scaleThreshold()
      .domain(this.data.thresholds)
      .range(d3.schemeOranges[9]);
  }

  color(value: number | null): string {
    if (value === null) {
      return '#b4b4b4'
    }
    return this.colors(value);
  }

  setFeatures(){
    this.features = topojson.feature(this.geodata, this.geodata.objects['CNTR_RG_60M_2020_4326']);
  }

  setDataFeatures() {
    const ids = new Set(this.data.data.map((d) => d.id));
    this.dataFeatures = this.features.features?.filter((feature) => ids.has(feature.properties.ISO3_CODE)) || [];
  }

  setLabels() {}
  setLegend() {}
  draw() {
    this.drawBaseLayer();
    this.drawDataLayer();
  }

  drawBaseLayer() {
    this.containers.countries.select('path.countries')
      .datum(this.features)
      .attr('d', this.path);
  }

  drawDataLayer() {
    this.containers.data.selectAll('path.data')
    .data(this.dataFeatures)
    .join('path')
    .attr('class', 'data')
    .attr('d', this.path)
    .style('fill', (d) => this.color(this.getValueByFeature(d)));
  }

  getValueByFeature(feature: any): number {
    const id = feature.properties.ISO3_CODE;
    return this.data.data.find((d) => d.id === id)?.value || null;
  }

  setScale(scale: number) {
    this.projection.scale(scale);
    this.setPath();
    this.draw();
  }

  setTranslate(x: number, y:number) {
    this.projection.translate([x, y]);
    this.setPath();
    this.draw();
  }

  setCenter(x: number, y: number) {
    this.projection.center([x, y]);
    this.setPath();
    this.draw();
  }

  setRotate(x: number, y: number, z: number) {
    this.projection.rotate([x, y, z]);
    this.setPath();
    this.draw();
  }

  setExtent(width, height) {
    this.projection.fitSize([width, height], this.features);
    this.setPath();
    this.draw();

  }
 
  setWidth(width) {
    this.projection.fitWidth(width, this.features);
    this.setPath();
    this.draw();

  }
  setHeight(height) {
    this.projection.fitHeight(height, this.features);
    this.setPath();
    this.draw();

  }

}
