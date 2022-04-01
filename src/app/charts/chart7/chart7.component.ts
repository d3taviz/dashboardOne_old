import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';
import { ChartDimensions } from 'src/app/helpers/chart.dimensions.helper';
import ObjectHelper from 'src/app/helpers/object.helper';
import { IGroupStackConfig, IGroupStackData, IGroupStackDataElem } from 'src/app/interfaces/chart.interfaces';

@Component({
  selector: 'app-chart7',
  template: `<svg class="chart7">
    <style>
      .chart { font-size: 12px; }
      .chart7 text.title { font-weight: bold;}
      .chart7 rect { fill: unset; }
    </style>
  </svg>`,
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

  // scales
  scales: any = {};

  private _defaultData: IGroupStackData = {
    title: '',
    yLabel: '',
    unit: '',
    data: [],
    stackOrder: []
  };

  private _data: IGroupStackData;

  @Input() set data(values) {
    this._data = ObjectHelper.UpdateObjectWithPartialValues(this._defaultData, values);
  };

  get data() {
    if (!this._data) { this._data = this._defaultData; }

    return this._data;
  }

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

  stackedData: any;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);

   }

  ngOnInit(): void {
    this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
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
    .attr('transform', `translate(${this.dimensions.marginLeft - 30}, ${this.dimensions.midHeight})`)
    .append('text').attr('class', 'yLabel')
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)');

    // tooltip
  }

  setParams(): void {
    // xScale
    this.setXScale();
    // yscale
    this.setYScale();
    //groupscale
    this.setGroupScale();
    //colorscale
    this.setColorScale();
  }

  setXScale(): void {
    const data = this.data.data;
    // group ids
    const domain = Array.from(new Set(data.map((d) => d.domain))).sort(d3.ascending);

    const range = [0, this.dimensions.innerWidth];
    this.scales.x = d3.scaleBand().domain(domain).range(range);
  }

  setYScale(): void {
    const data = this.data.data;

    const minVal = Math.min(0, d3.min(data, d => d.value));
    const maxVal = d3.max(d3.flatRollup(data, v => d3.sum(v, d => d.value), d => d.domain, d => d.group), d => d[2]);

    const domain = [minVal, maxVal];
    const range = [this.dimensions.innerHeight, 0];

    this.scales.y = d3.scaleLinear().domain(domain).range(range);
  }

  setGroupScale(): void {
    const data = this.data.data;

    const domain = Array.from(new Set(data.map((d) => d.group))).sort(d3.ascending);
    const range = [0, this.scales.x.bandwidth()];

    this.scales.group = d3.scaleBand().domain(domain).range(range);
  }

  setColorScale(): void {
    const data = this.data.data;
    const stacks = Array.from(new Set(data.map((d) => d.stack)));
    const domain = [stacks.length - 1, 0];

    this.scales.color = d3.scaleSequential(d3.interpolateSpectral).domain(domain);
  }

  setLabels(): void {
    this.title.text(this.data.title);
    this.yLabel.text(this.data.yLabel);
  }

  setAxis(): void {
    this.setXAxis();
    this.setYAxis();
  }

  setXAxis(): void {
    this.xAxis = d3.axisBottom(this.scales.x)
    .tickSizeOuter(0);

    this.xAxisContainer.call(this.xAxis);
  }

  setYAxis(): void {
    this.yAxis = d3.axisLeft(this.scales.y)
    .ticks(5)
    .tickSizeOuter(0)
    .tickSizeInner(-this.dimensions.innerWidth);

    this.yAxisContainer.call(this.yAxis);

    this.yAxisContainer.selectAll('.tick line')
    .style('opacity', 0.3)
    .style('stroke-dasharray', '3 3');
  }

  setLegend(): void {
    const data = this.data.stackOrder;

    const width = 35;
    const height = 12;
    const fontSize = 10;

    const color = (elem) => this.scales.color(data.indexOf(elem));

    const generateLegendItem = (selection) => {
      selection.append('rect')
      .attr('class', 'legend-icon')
      .attr('width', width)
      .attr('height', height)
      .style('fill', (d) => color(d));

      selection.append('text')
        .attr('class', 'legend-label')
        .attr('x', 0.5 * width)
        .attr('y', height + fontSize + 1)
        .style('font-size', fontSize + 'px')
        .style('text-anchor', 'middle')
        .text((d) => d);
    }

    const updateLegendItem = (selection) => {
      selection.selectAll('rect.lengend-icon')
      .style('fill', (d) => d.color);

      selection.append('text')
      .text((d) => d);
    }

    // set item containers
    this.legendContainer.selectAll('g.legend-item')
      .data(data, d => d)
      .join(
        enter => enter.append('g')
          .call(generateLegendItem),
        update => update
          .call(updateLegendItem)
      )
      .attr('class', 'legend-item');

    // reposition elements
    // a. reposition legend items
    let padding = 0;

    this.legendContainer.selectAll('g.legend-item')
    .each(function() {
      const g = d3.select(this);
      g.attr('transform', `translate(${padding}, 0)`);

      padding += g.node().getBBox().width;
    })
    //b. reposition the legend
    const legendWidth = this.legendContainer.node().getBBox().width;

    const axisHeight = this.xAxisContainer.node().getBBox().height;
    this.legendContainer
    .attr('transform', `translate(${this.dimensions.midWidth - 0.5 * legendWidth}, ${this.dimensions.marginBottom + axisHeight + 10})`)
  }

  draw(): void {
    this.setStackedData();
    this.drawRectangles();
  }

  setStackedData(): void {
    const data = this.data.data;
    const groupedData = d3.groups(data, d => d.domain + '__' + d.group);

    const keys = this.data.stackOrder; //d3.groups(data, d => d.stack).map((d) => d[0]);
    console.log(groupedData, keys);
    const stack = d3.stack()
      .keys(keys)
      .value((element, key) => element[1].find(d => d.stack === key).value);

    this.stackedData = stack(groupedData);

    console.log(this.stackedData);

  }

  drawRectangles(): void {
    const data = this.stackedData;

    const colors = d3.schemeCategory10;

    this.dataContainer.selectAll('g.series')
    .data(data, d => d.key)
    .join('g')
    .attr('class', 'series')
    .style('fill', (d, i) => this.scales.color(i))
    .selectAll('rect.data')
    .data(d => d, d => d.data.year)
    .join('rect')
    .attr('class', 'data')
    //.attr('x', d => this.scales.x(d.data.year + ''))
    .attr('x', d => {
      const [domain, group] = d.data[0].split('__');
      return this.scales.x(domain) + this.scales.group(group);
    })
    .attr('width', this.scales.group.bandwidth())
    .attr('y', (d) => this.scales.y(d[1]))
    .attr('height', (d) => Math.abs(this.scales.y(d[0]) - this.scales.y(d[1])))
    .attr('stroke', 'white');
  }

  updateChart(): void {
    this.setParams();
    this.setLabels();
    this.setAxis();
    this.setLegend();
    this.draw();
  }

  // tooltip

  // highlight
  data1 = [
    {
      year: 2002,
      apples: 3840,
      bananas: 1920,
      cherries: 960,
      dates: 400,
    },
    {
      year: 2003,
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400,
    },
    {
      year: 2004,
      apples: 640,
      bananas: 960,
      cherries: 640,
      dates: 400,
    },
    {
      year: 2005,
      apples: 320,
      bananas: 480,
      cherries: 640,
      dates: 400,
    },
  ];

  data2 = [
    {
      year: 2002,
      fruit: 'apples',
      value: 3840,
    },
    {
      year: 2003,
      fruit: 'apples',
      value: 1600,
    },
    {
      year: 2004,
      fruit: 'apples',
      value: 640,
    },
    {
      year: 2005,
      fruit: 'apples',
      value: 320,
    },
    {
      year: 2002,
      fruit: 'bananas',
      value: 1920,
    },
    {
      year: 2003,
      fruit: 'bananas',
      value: 1440,
    },
    {
      year: 2004,
      fruit: 'bananas',
      value: 960,
    },
    {
      year: 2005,
      fruit: 'bananas',
      value: 480,
    },
    {
      year: 2002,
      fruit: 'cherries',
      value: 960,
    },
    {
      year: 2003,
      fruit: 'cherries',
      value: 960,
    },
    {
      year: 2004,
      fruit: 'cherries',
      value: 640,
    },
    {
      year: 2005,
      fruit: 'cherries',
      value: 640,
    },
    {
      year: 2002,
      fruit: 'dates',
      value: 400,
    },
    {
      year: 2003,
      fruit: 'dates',
      value: 400,
    },
    {
      year: 2004,
      fruit: 'dates',
      value: 400,
    },
    {
      year: 2005,
      fruit: 'dates',
      value: 400,
    },
  ];

}
