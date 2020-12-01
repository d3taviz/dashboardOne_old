import { Component, OnInit, ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart3',
  template: `<svg></svg>`,
  styleUrls: ['./chart3.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Chart3Component implements OnInit, OnChanges {
  host: any;
  svg: any;
  dataContainer: any;
  xAxisContainer: any;
  yAxisContainer: any;
  xAxis: any;
  yAxis: any;

  @Input() data;

  rectWidth = 30;
  padding = 5;
  dimensions: DOMRect;
  innerWidth;
  innerHeight;
  left = 60; right = 20; bottom = 20; top = 15;

  x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
  y = d3.scaleLinear();

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);

    console.log(this);
   }

  ngOnInit() {
    this.svg = this.host.select('svg');

    this.setDimensions();
    this.setElements();

  }

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;
  }

  setElements() {
    this.xAxisContainer = this.svg.append('g').attr('class', 'xAxisContainer')
    .attr('transform', `translate(${this.left}, ${this.top + this.innerHeight})`);
    this.yAxisContainer = this.svg.append('g').attr('class', 'yAxisContainer')
    .attr('transform', `translate(${this.left}, ${this.top})`);
    this.dataContainer = this.svg.append('g').attr('class', 'dataContainer')
    .attr('transform', `translate(${this.left}, ${this.top})`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.svg) return;
    this.setParams();
    this.draw();
  }

  setParams() {
    const ids = this.data.map((d) => d.id);
    this.x.domain(ids).range([0, this.innerWidth]);
    const max_salary = 1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.y.domain([0, max_salary]).range([this.innerHeight, 0]);

    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y).tickSize(-this.innerWidth);

    this.xAxisContainer.call(this.xAxis);
    this.yAxisContainer.call(this.yAxis);
  }

  draw() {
    this.dataContainer.selectAll('rect')
    .data(this.data || [])
    .enter().append('rect')
    .attr('x', (d) => this.x(d.id))
    .attr('width', this.x.bandwidth())
    .attr('height', (d) => this.innerHeight -this.y(d.employee_salary))
    .attr('y', (d) => this.y(d.employee_salary));
  }

}
