import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chart5',
  templateUrl: './chart5.component.html',
  styleUrls: ['./chart5.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Chart5Component implements OnInit {

  @Input() data;

  constructor() {}

  ngOnInit(): void {}


}
