import { Component, ElementRef } from '@angular/core';
import { ISwarmData } from 'src/app/interfaces/chart.interfaces';
import { DimensionsService } from 'src/app/services/dimensions.service';
import { Chart } from '../chart';

@Component({
  selector: 'app-chart9',
  template: `<svg class="swarm-chart"></svg>`,
  styles: [
  ],
  providers: [DimensionsService]
})
export class Chart9Component extends Chart<ISwarmData, any> {
  constructor(element: ElementRef, dimensions: DimensionsService) {
    super(element, dimensions);
    console.log(this);
    
  }

  protected _defaultConfig: any = {
    margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  };

  onSetData = () => {}

  onSetConfig = () => {}

}
