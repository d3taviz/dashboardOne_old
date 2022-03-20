import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';
import { ChartDimensions } from 'src/app/helpers/chart.dimensions.helper';
import ObjectHelper from 'src/app/helpers/object.helper';
import { IGroupStackConfig } from 'src/app/interfaces/chart.interfaces';

@Component({
  selector: 'app-chart7',
  template: `<svg class="chart7"></svg>`,
  styles: []
})
export class Chart7Component implements OnInit, OnChanges {

  host: any;
  svg: any;

  dimensions: ChartDimensions;

  // axis
  xAxis: any;
  yAxis: any;

  // containers
  xAxisContainer: any;
  yAxisContainer: any;
  dataContainer: any;
  legendContainer: any;
  tooltipContainer: any;

  // labels
  title: any;
  yLabel: any;

  @Input() data;

  @Input() set config(values: Partial<IGroupStackConfig>) {
    this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, values);
  }

  get config() {
    if (!this._config) {
      this.config = this._defaultConfig;
    }

    return this._config;
  }

  private _config: IGroupStackConfig;

  private _defaultConfig: IGroupStackConfig = {
    hiddenOpacity: 0.3,
    transition: 300,
    margins: {
      top: 40,
      right: 20,
      bottom: 60,
      left: 50
    }
  }

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);

   }

  ngOnInit(): void {
    this.svg = this.host.select('svg');
    this.setDimensions();
    this.setElements();
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (!this.svg) { return; }

      this.updateChart();
  }

  setDimensions(): void {
    this.dimensions = new ChartDimensions(this.svg.node().getBoundingClientRect(), this.config.margins);
  }

  setElements(): void {
    this.xAxisContainer = this.svg.append('g').attr('class', 'xAxisContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom})`);

    this.yAxisContainer = this.svg.append('g').attr('class', 'yAxisContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);

    this.dataContainer = this.svg.append('g').attr('class', 'dataContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);

    this.legendContainer = this.svg.append('g').attr('class', 'legendContainer')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom + 30})`);

    this.title = this.svg.append('g').attr('class', 'titleContainer')
      .attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`)
      .append('text').attr('class', 'title')
      .style('text-anchor', 'middle');

    this.yLabel = this.svg.append('g').attr('class', 'yLabelContainer')
    .attr('transform', `translate(${this.dimensions.marginLeft - 30}, ${this.dimensions.marginTop})`)
    .append('text').attr('class', 'titlyLabele')
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)');

    // tooltip
  }

  setParams(): void {}
  setLabels(): void {}
  setAxis(): void {}
  setLegend(): void {}
  draw(): void {}

  updateChart(): void {
    this.setParams();
    this.setLabels();
    this.setAxis();
    this.setLegend();
    this.draw();
  }

  // tooltip

  // highlight


}
