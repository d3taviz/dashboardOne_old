import { Component, ElementRef } from '@angular/core';
import { ISwarmData, ISwarmDataElement } from 'src/app/interfaces/chart.interfaces';
import { DimensionsService } from 'src/app/services/dimensions.service';
import { Chart } from '../chart';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart9',
  template: `<svg class="swarm-chart">
    <style>
      .swarm-chart .label {
        text-anchor: middle;
        dominant-baseline: central;
      }
      .swarm-chart .title {
        font-weight: bold;
        font-size: 12px;
      }
      .swarm-chart .yLabel {
        font-size: 12px;
      }
    </style>
  </svg>
  `,
  styles: [
  ],
  providers: [DimensionsService]
})
export class Chart9Component extends Chart<ISwarmData, any> {
  constructor(element: ElementRef, dimensions: DimensionsService) {
    super(element, dimensions);
    console.log(this);
    
  }

  protected _defaultConfig: any = {
    margins: {
      top: 30,
      bottom: 50,
      left: 50,
      right: 20
    }
  };

  groups: Array<string | number> = [];

  setElements = () => {
    this.svg.append('g').attr('class', 'title').append('text').attr('class', 'title label');
    this.svg.append('g').attr('class', 'yAxis');
    this.svg.append('g').attr('class', 'xAxis');
    this.svg.append('g').attr('class', 'yLabel')
      .append('text').attr('class', 'yLabel label')
      .attr('transform', 'rotate(-90)');

    this.svg.append('g').attr('class', 'data');
  }

  positionElements = () => {
    this.svg.select('g.title').attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);
    this.svg.select('g.yAxis').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
    this.svg.select('g.xAxis').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom})`);
    this.svg.select('g.yLabel').attr('transform', `translate(${12 + 5}, ${this.dimensions.midHeight})`);
    this.svg.select('g.data').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
  }

  setParams = () => {
    this.setGroups();
    this.setScales();
    this.setScaledData();
    this.setSimulatedData();
    this.setAxis();
  }

  setGroups = () => {
    this.groups = d3.groups(this.data.data, (d: ISwarmDataElement) => d.group)
      .map((d: any) => d[0])
      .sort(d3.ascending);
  }

  setScales = () => {
    this.setXScale();
    this.setYScale();
    this.setColorScale();
  }

  setXScale = () => {
    const domain = d3.groups(this.data.data, (d: ISwarmDataElement) => d.category)
      .map((d: any) => d[0])
      .sort(d3.ascending);
    
    const range = [0, this.dimensions.innerWidth];

    this.scales['x'] = d3.scalePoint()
      .domain(domain)
      .range(range)
      .padding(0.5);
  }

  setYScale = () => {
    let [min, max] = d3.extent(this.data.data, (d:ISwarmDataElement) => d.value);

    min = Math.min(min || 0, 0);
    
    const domain = [min === undefined ? 0 : min, max === undefined ? 1 : max];

    const range = [this.dimensions.innerHeight, 0];

    this.scales['y'] = d3.scaleLinear().domain(domain).range(range);
  }

  setColorScale = () => {
    const domain = this.groups;

    const range = d3.schemeTableau10;

    this.scales.colors = d3.scaleOrdinal<string | number, string>().domain(domain).range(range);
    console.log(this.scales.colors);
    
  }

  setScaledData = () => {}

  setSimulatedData = () => {}

  setAxis = () => {
    const xAxis = d3.axisBottom(this.scales.x)
      .tickSizeOuter(0);

    this.svg.select<SVGGElement>('g.xAxis').call(xAxis);

    const yAxis = d3.axisLeft(this.scales.y)
      .tickSizeOuter(0)
      .tickSizeInner(-this.dimensions.innerWidth);

    this.svg.select<SVGGElement>('g.yAxis').call(yAxis);

    this.svg.select('g.yAxis').selectAll('.tick line')
      .style('stroke', '#ddd')
      .style('stroke-dasharray', '2 2');
  }

  setLabels = () => {
    this.svg.select('text.title').text(this.data.title);
    this.svg.select('text.yLabel').text(this.data.unit);
  }
  
  setLegend = () => {}

  draw = () => {
    const data = this.data.data;

    this.svg.select('g.data').selectAll('circle.data')
      .data(data)
      .join('circle')
      .attr('class', 'data')
      .attr('cx', (d: any) => this.scales.x(d.category))
      .attr('cy', (d: any) => this.scales.y(d.value))
      .attr('r', 3)
      .style('fill', (d: any) => this.scales.colors(d.group));
  }

  onSetData = () => {
    if(!this.chartIsInitialized || !this.dataIsInitialized) { return; }
    this.updateChart();
  }

  onSetConfig = () => {}

}
