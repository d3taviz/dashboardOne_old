import { Component, ElementRef, Input, OnInit } from '@angular/core';

import * as d3 from 'd3';
import { ITimelineConfig, ITimelineData } from 'src/app/interfaces/chart.interfaces';
import { DimensionsService } from 'src/app/services/dimensions.service';

@Component({
  selector: 'app-timeline-tooltip',
  template: `
    <svg class="timeline-tooltip">
      <style>
        .timeline-tooltip {background-color: red;}
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

  setSvg(): void {
    this.svg = this.host.select('svg')
      .style('width', this.config.dimensions.width + 'px')
      .style('height', this.config.dimensions.height + 'px');
  }

  setDimensions(): void {
    this.dimensions.setDimensions(this.svg.node().getBoundingClientRect());
    this.dimensions.setMargins(this.config.margins);
  }

  updateChart(): void {}

  positionElements(): void {
    this.svg.select('g.title')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.midMarginTop})`);

    this.svg.selectAll('g.container, g.active-container')
      .attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
  }

}
