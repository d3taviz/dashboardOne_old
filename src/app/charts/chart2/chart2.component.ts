import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chart2',
  templateUrl: './chart2.component.html',
  styleUrls: ['./chart2.component.scss']
})
export class Chart2Component implements OnInit, OnChanges {

  @Input() data: any;
  xlabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  rectWidth = 80;
  max = 250;
  dimensions: DOMRect = new DOMRect();
  outerPadding = 20;
  padding = 0;
  bandwidth = 0;
  bandwidthCoef = 0.8; // 80% = 0.8;
  left = 10; right = 20; bottom = 16; top = 15;
  innerWidth: number = 300;
  innerHeight: number = 150;
/*   margin = {
    left: 10,
    right: 20,
    bottom:30,
    top: 15
  }; */

  // width = width svg / number of rectangles
  // width = svg.width / data.length

  constructor(private element: ElementRef) {
   }

  ngOnInit() {
    const svg = this.element.nativeElement.getElementsByTagName('svg')[0];
    this.dimensions = svg.getBoundingClientRect();
    this.innerWidth = this.dimensions.width - this.left - this.right;
    this.innerHeight = this.dimensions.height - this.top - this.bottom;

    this.setParams();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.setParams();
  }

  setParams() {
    const data = this.data || [100];
    this.rectWidth = (this.innerWidth - 2 * this.outerPadding) / data.length;
    this.bandwidth = this.bandwidthCoef * this.rectWidth;
    this.padding = (1 - this.bandwidthCoef) * this.rectWidth;

    this.max = 1.3 * Math.max(...data.map((item: any) => item.employee_salary)); // 1.3 = 130%
  }

}
