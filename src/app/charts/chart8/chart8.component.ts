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

      .chart8 text.title {
        text-anchor: middle;
        font-size: 12px;
        font-weight: bold;
        dominant-baseline: middle;
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
      top: 40,
      left: 20,
      right: 20,
      bottom: 40
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
      .domain(this.data.thresholds.slice(2, this.data.thresholds.length))
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

  setLabels() {
    this.title.text(this.data.title);
  }

  setLegend() {
    const data = this.data.thresholds;

    const width = 30;
    const height = 10;
    const fontSize = 10;
    const nodataSeparator = 10;
    const nodataLabel = 'no data';

    const generateLegendItem = (selection) => {
      selection.append('rect')
      .attr('class', 'legend-icon')
      .attr('width', width)
      .attr('height', height)
      .style('fill', (d) => this.color(d));

      selection.append('text')
        .attr('class', 'legend-label')
        .attr('x', (d) => d === null ? 0.5 * width : 0)
        .attr('y', height + fontSize + 1)
        .style('font-size', fontSize + 'px')
        .style('text-anchor', 'middle')
        .text((d) => d === null ? nodataLabel : d);
    }

    const updateLegendItem = (selection) => {
      selection.selectAll('rect.lengend-icon')
      .style('fill', (d) => d.color);

      selection.select('text.legend-label')
      .text((d) => d);
    }

    // set legend items
    this.containers.legend.selectAll('g.legend-item')
      .data(data)
      .join(
        enter => enter.append('g')
        .call(generateLegendItem),
      update => update
        .call(updateLegendItem)
      )
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${i * width + (i && nodataSeparator || 0)}, 0)`);

       // reposition elements

    //b. reposition the legend
    const legendBox = this.containers.legend.node().getBBox();

    this.containers.legend
      .attr('transform', `translate(
        ${this.dimensions.midWidth - 0.5 * legendBox.width},
        ${this.dimensions.midMarginBottom - 0.5 * legendBox.height}
      )`);
  }

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
