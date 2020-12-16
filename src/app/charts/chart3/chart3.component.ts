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
  textButton: any;

  @Input() data;

  rectWidth = 30;
  padding = 5;
  dimensions: DOMRect;
  innerWidth;
  innerHeight;
  left = 60; right = 20; bottom = 20; top = 35;

  x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
  y = d3.scaleLinear();

  xAxis = d3.axisBottom();
  yAxis = d3.axisLeft();

  // false = by id, true = by salary
  sortingState = false;

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);

    console.log(this);
   }

  ngOnInit() {
    const chart = this;
    this.svg = this.host.select('svg');

    this.setDimensions();

    this.xAxisContainer = this.svg.append('g').attr('class', 'xAxisContainer')
    .attr('transform', `translate(${this.left}, ${this.top + this.innerHeight})`);

    this.yAxisContainer = this.svg.append('g').attr('class', 'yAxisContainer')
    .attr('transform', `translate(${this.left}, ${this.top})`);

    this.dataContainer = this.svg.append('g').attr('class', 'dataContainer')
    .attr('transform', `translate(${this.left}, ${this.top})`);

    this.textButton = this.svg.append('text')
    .attr('class', 'text-button')
    .text('Sort data')
    .attr('x', 60).attr('y', 20)
    .on('click', function() {
      chart.sortData();
    });
  }

  setDimensions() {
    this.dimensions = this.svg.node().getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.svg) return;
    this.setParams();
    this.setAxis();
    this.draw();
  }

  setAxis() {
    this.xAxis.scale(this.x);
    this.xAxisContainer.transition().duration(3000).call(this.xAxis);

    this.yAxis.scale(this.y).tickSize(-this.innerWidth);
    this.yAxisContainer.call(this.yAxis);

    this.yAxisContainer.selectAll('.tick line').style('stroke', '#ddd');
  }

  setParams() {
    const ids = this.data.map((d) => d.id);
    this.x.domain(ids).range([0, this.innerWidth]);
    const max_salary = 1.3 * Math.max(...this.data.map((item) => item.employee_salary));
    this.y.domain([0, max_salary]).range([this.innerHeight, 0]);
  }

  draw() {
    // bind the data to the rectangles
    const rects = this.dataContainer.selectAll('rect')
    .data(this.data || []);

    rects.transition()
    .duration(3000)
    .attr('x', (d) => this.x(d.id))
    .attr('width', this.x.bandwidth())
    .attr('y', (d) => this.y(d.employee_salary))
    .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));
    // add new rectangles and updating existing ones
    rects.enter().append('rect')
    .attr('x', (d) => this.x(d.id))
    .attr('width', this.x.bandwidth())
    .attr('y', this.innerHeight)
    .transition()
    .duration(3000)
    .attr('y', (d) => this.y(d.employee_salary))
    .attr('height', (d) => this.innerHeight - this.y(d.employee_salary));

    // remove rectangles not needed;
    rects.exit().remove();
  }

  sortData() {
    // change the sorting state
    this.sortingState = !this.sortingState;

    // sort the data
    if (this.sortingState) {
      // sort by salary
      this.data.sort(this.sortBYSalary);
    } else {
      // sort by id
      this.data.sort(this.sortById);
    }
    // set params
    this.setParams();
    // update axis
    this.setAxis();
    // draw the chart with new data
    this.draw();
  }

  sortById = (a, b) => +a.id - +b.id;

  sortBYSalary = (a, b) => +b.employee_salary - +a.employee_salary;

}
