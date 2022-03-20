import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-chart7',
  template: `<svg class="chart7"></svg>`,
  styles: []
})
export class Chart7Component implements OnInit, OnChanges {

  host: any;
  svg: any;

  @Input() data;

  @Input() config;

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

  setDimensions(): void {}
  setElements(): void {}
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
