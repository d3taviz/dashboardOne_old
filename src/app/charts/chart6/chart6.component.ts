import { Component, Input, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { map } from 'rxjs/operators';
import { IPieConfig, IPieData } from 'src/app/interfaces/chart.interfaces';

@Component({
  selector: 'app-chart6',
  templateUrl: './chart6.component.html',
  styleUrls: ['./chart6.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Chart6Component implements OnInit {

  host: any;
  svg: any;

  // containers
  dataContainer: any;
  legendContainer: any;

  title: any;

  // functions
  pie: any;
  arc: any;

  // scales
  colors: any;

  // state
  hiddenIds = new Map();

  @Input() data: IPieData;

  config: IPieConfig = {
    innerRadiusCoef: 0.7,
    hiddenOpacity: 0.3,
    legendItem: {
      symbolSize: 10,
      height: 20,
      fontSize: 12,
      textSeparator: 15
    },
    transition: 800,
    arcs: {
      stroke: '#fff',
      strokeWidth: 2,
      radius: 6,
      padAngle: 0
    },
    margins: {
      left: 10,
      top: 40,
      right: 130,
      bottom: 10
    }
  };

  //dimensions
  dimensions: DOMRect;

  innerWidth: number;
  innerHeight: number;
  radius: number;
  innerRadius = 0;

  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  constructor(element: ElementRef) {
    this.host = d3.select(element.nativeElement);
    console.log(this);

   }

  ngOnInit(): void {
  }

}
