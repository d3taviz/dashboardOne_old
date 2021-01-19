import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart4',
  templateUrl: './chart4.component.html',
  styleUrls: ['./chart4.component.scss']
})
export class Chart4Component implements OnInit {

  @Input() data;

  xValue: string;
  yValue: string;

  constructor() {
    console.log(this);
  }

  ngOnInit(): void {
  }

  setOption(option: string, event) {
    const value = event && event.target && event.target.value;

    switch(option) {
      case 'x':
        this.xValue = value;
        break;
      case 'y':
        this.yValue = value;
        break;
    }

    this.updateChart();
  }

  updateChart() {}

}
