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

  @Input() data;

  rectWidth = 30;
  padding = 5;
  dimensions: DOMRect;
  innerWidth;
  innerHeight;
  xAxis: any;
  yAxis: any;
  left = 60; right = 20; bottom = 80; top = 15;

  x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
  y = d3.scaleLinear();

  sortedBySalary = true;

  get barsData() {
    return this.sortedBySalary
    ? this.data.sort((a, b) => +b.employee_salary - a.employee_salary)
    : this.data.sort((a, b) => a.employee_name < b.employee_name ? -1 : 1);
  }

  get ids() {
    return this.barsData.map((d) => d.id);
  }

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);

    console.log(this);
   }

  ngOnInit() {
    this.svg = this.host.select('svg')
    .on('click', () => this.changeData());

    this.setDimensions();

    this.setElements();
  }

  changeData() {
    this.sortedBySalary = !this.sortedBySalary;
    this.updateChart();
  }

  setElements() {
    this.xAxisContainer = this.svg.append('g').attr('class', 'xAxisContainer')
    .attr('transform', `translate(${this.left}, ${this.top + this.innerHeight})`);
    this.yAxisContainer = this.svg.append('g').attr('class', 'yAxisContainer')
    .attr('transform', `translate(${this.left}, ${this.top})`);
    this.dataContainer = this.svg.append('g').attr('class', 'dataContainer')
    .attr('transform', `translate(${this.left}, ${this.top})`);
  }

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;
    this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.svg) return;
    this.updateChart();
  }

  updateChart() {
    this.setParams();
    this.setAxis();
    this.setLabels();
    this.draw();
  }

  setLabels() {
    this.svg.append('g')
    .attr('transform', `translate(15, ${0.5 * this.innerHeight + this.top})`)
    .append('text').attr('class', 'label').text('Employee salary')
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle');

    this.xAxisContainer.selectAll('.tick text').text(this.getEmployeeName)
    .attr('transform', 'translate(-10,2)rotate(-45)')
    .style('text-anchor', 'end');
  }

  getEmployeeName = (id) => this.data.find((d) => d.id === id).employee_name;

  setAxis() {
    this.xAxis = d3.axisBottom(this.x);
    this.xAxisContainer.call(this.xAxis);

    this.yAxis = d3.axisLeft(this.y).tickSizeInner(-this.innerWidth).tickFormat(d3.format('$~s'));
    this.yAxisContainer.call(this.yAxis);

    this.yAxisContainer.selectAll('.tick line').style('stroke', '#ddd');
    // this.yAxisContainer.selectAll('.tick text').style('fill', '#ddd');
  }

  setParams() {
    this.x.domain(this.ids).range([0, this.innerWidth]);
    const max_salary = 1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.y.domain([0, max_salary]).range([this.innerHeight, 0]);
  }

  draw() {
    const bars = this.dataContainer.selectAll('rect')
    .data(this.barsData || [], (d) => d.id);

    bars.enter().append('rect')
    .merge(bars)
    .attr('x', (d) => this.x(d.id))
    .attr('width', this.x.bandwidth())
    .attr('y', (d) => this.y(d.employee_salary))
    .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));

    bars.exit().remove();
  }

}
