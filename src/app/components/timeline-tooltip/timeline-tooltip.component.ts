import { style } from '@angular/animations';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';
import { ITimelineConfig, ITimelineData } from 'src/app/interfaces/chart.interfaces';
import { DimensionsService } from 'src/app/services/dimensions.service';

@Component({
  selector: 'app-timeline-tooltip',
  template: `
    <svg class="timeline-tooltip">
      <style>
        .timeline-tooltip {
          background-color: {{config.background.color}};
          box-shadow: rgba(158, 158, 158, 0.16) 1px 1px 8px 0px;
        }
        .timeline-tooltip text.title {
          text-align: center;
          font-weight: {{config.title.fontWeight}};
          font-size: {{config.title.fontSize}}px;
          text-anchor: middle;
          dominant-baseline: middle;
        }
        .timeline-tooltip .label {
          font-size: {{config.labels.fontSize}}px;
          text-anchor: end;
          dominant-baseline: central;
        }
        .timeline-tooltip .axis, .timeline-tooltip .axis--max, .timeline-tooltip .active {
          stroke: {{config.axis.color}};
        }
        .timeline-tooltip .axis--max, .timeline-tooltip .active {
          stroke-dasharray: 1 1;
        }
        .timeline-tooltip path.line {
          fill: none;
          stroke: {{config.line.stroke}};
        }
        .timeline-tooltip path.area {
          fill: {{config.area.fill}};
          stroke: none;
          opacity: {{config.area.opacity}};
        }
        .timeline-tooltip circle {
          stroke: {{config.circle.stroke}};
          fill: {{config.circle.fill}};
        }
      </style>
      <g class="title">
        <text class="title"></text>
      </g>
      <g class="container">
        <line class="axis axis--x"></line>
        <line class="axis axis--max"></line>
        <text class="label max-value"></text>
        <path class="area"></path>
        <path class="line"></path>
      </g>
      <g class="active-container">
        <line class="active active-horizontal"></line>
        <line class="active active-vertical"></line>
        <circle class="active-circle"></circle>
        <text class="label active-value"></text>
        <text class="label active-date"></text>
      </g>
    </svg>
  `,
  styleUrls: ['./timeline-tooltip.component.scss'],
  providers: [DimensionsService]
})
export class TimelineTooltipComponent implements OnInit {

  host: any;
  svg: any;

  maxValue: number;
  activeValue: number;

  scales: any = {};

  line: any;

  area: any;

  private _data: ITimelineData;

  @Input() set data(values) {
    this._data = values;
    if (!this.svg) { return; }
    this.updateChart();
  }

  get data() {
    return this._data || {title: '', data: [], activeTime: null, timeFormat: ''};
  }

  config: ITimelineConfig = {
    margins: {
      left: 25,
      right: 20,
      top: 25,
      bottom: 20
    },
    dimensions: {
      width: 270,
      height: 150
    },
    background: {
      color: '#fff',
    },
    title: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    labels: {
      fontSize: 9
    },
    line: {
      stroke: 'rgb(253, 141, 60)'
    },
    area: {
      fill: 'rgb(253, 141, 60)',
      opacity: 0.5
    },
    axis: {
      color: '#444'
    },
    circle: {
      stroke: 'rgb(127, 39, 4)',
      fill: 'rgb(253, 141, 60)',
      radius: 3
    },
    values: {
      decimalPlaces: 1,
      xPadding: 5,
      yPadding: 12
    }
  }

  constructor(element: ElementRef, public dimensions: DimensionsService) {
    this.host = d3.select(element.nativeElement);
   }

  ngOnInit(): void {
    this.setSvg();
    this.setDimensions();
    this.updateChart();
  }

  rounding(value: number): number {

    const factor = Math.pow(10, this.config.values.decimalPlaces);

    return Math.round(factor * value) / factor;
  }

  setSvg(): void {
    this.svg = this.host.select('svg')
      .style('width', this.config.dimensions.width + 'px')
      .style('height', this.config.dimensions.height + 'px');
  }

  setDimensions(): void {
    this.dimensions.setDimensions(this.svg.node().getBoundingClientRect());
    this.dimensions.setMargins(this.config.margins);
  }

  updateChart(): void {
    this.positionElements();
    //setParams
    this.setParams();
    //setLabels
    this.setLabels();
    //setLines
    this.setLines();
    // draw line and area
    this.drawArea();
    this.drawLine();
    //setActiveData
    this.setActiveData();
  }

  setParams(): void {
    //calculate maximum value
    this.calculateMaxValue();
    //get the active value
    this.getActiveValue();
    //set the scales
    this.setScales();
    //set the area and line functions
    this.setArea();
    this.setLine();
  }

  calculateMaxValue(): void {
    const maxIndex = d3.maxIndex(this.data.data, (d) => d.value);

    this.maxValue = this.data.data[maxIndex].value;
  }

  getActiveValue(): void {
    this.activeValue = this.data.data.find((d) => d.date === this.data.activeTime)?.value || null;
  }

  setScales(): void {
    const xdomain = d3.extent(this.data.data, (d) => d.date);
    
    this.scales.x = d3.scaleLinear()
      .domain(xdomain)
      .range([0, this.dimensions.innerWidth]);

    this.scales.y = d3.scaleLinear()
      .domain([0, this.maxValue])
      .range([this.dimensions.innerHeight, 0]);
  }

  setArea(): void {
    const y0 = this.dimensions.innerHeight;

    this.area = d3.area()
      .defined((d) => d.value !== null)
      .x((d) => this.scales.x(d.date))
      .y0(y0)
      .y1((d) => this.scales.y(d.value));
  }

  setLine(): void {
    this.line = d3.line()
      .defined((d) => d.value !== null)
      .x((d) => this.scales.x(d.date))
      .y((d) => this.scales.y(d.value));
  }

  setLabels(): void {
    this.svg.select('text.title').text(this.data.title);
    //set maximum value
    this.svg.select('text.max-value')
      .text(this.rounding(this.maxValue))
      .attr('x', -this.config.values.xPadding)
      .attr('y', 0);
  }

  setLines(): void {
    this.svg.select('line.axis--x')
      .attr('x1', 0)
      .attr('x2', this.dimensions.innerWidth)
      .attr('y1', this.dimensions.innerHeight)
      .attr('y2', this.dimensions.innerHeight);

    this.svg.select('line.axis--max')
      .attr('x1', 0)
      .attr('x2', this.dimensions.innerWidth)
      .attr('y1', 0)
      .attr('y2', 0);
  }

  drawLine(): void {
    const data = this.data.data;

    this.svg.select('path.line')
      .attr('d', this.line(data));
  }

  drawArea(): void {
    const data = this.data.data;

    this.svg.select('path.area')
      .attr('d', this.area(data));
  }

  setActiveData(): void {
    this.svg.select('g.active-container')
      .style('visibility', this.activeValue === null ? 'hidden' : '');
    
    if (this.activeValue === null) { return; }

    const x = this.scales.x(this.data.activeTime);
    const y = this.scales.y(this.activeValue);

    //set horizontal line
    this.svg.select('line.active-horizontal')
      .attr('x1', 0)
      .attr('x2', x)
      .attr('y1', y)
      .attr('y2', y);
    //set the vertical line
    this.svg.select('line.active-vertical')
      .attr('x1', x)
      .attr('x2', x)
      .attr('y1', this.dimensions.innerHeight)
      .attr('y2', y);
    // set the circle
    this.svg.select('circle.active-circle')
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', this.config.circle.radius);
    // set the value label
    this.svg.select('text.active-value')
      .text(this.rounding(this.activeValue))
      .attr('x', -this.config.values.xPadding)
      .attr('y', y);
    // set the date label

    const isLeftSide = x < 0.5 * this.dimensions.innerWidth;

    this.svg.select('text.active-date')
      .text(d3.timeFormat(this.data.timeFormat)(this.data.activeTime))
      .attr('x', x + (isLeftSide ? -this.config.values.yPadding : this.config.values.yPadding))
      .attr('y', this.dimensions.innerHeight + this.config.values.yPadding)
      .style('text-anchor', isLeftSide ? 'start' : 'end');
  }

  positionElements(): void {
    this.svg.select('g.title')
      .attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);

    this.svg.selectAll('g.container, g.active-container')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
  }

}
