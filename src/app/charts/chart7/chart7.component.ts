import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart7',
  template: `<svg class="chart7"></svg>`,
  styles: []
})
export class Chart7Component implements OnInit {

  @Input() data;

  @Input() config;

  constructor() { }

  ngOnInit(): void {
  }

}
