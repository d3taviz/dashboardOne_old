import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-play-slider',
  templateUrl: './play-slider.component.html',
  styleUrls: ['./play-slider.component.scss']
})
export class PlaySliderComponent implements OnInit {

  private _value: number = 0;

  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() speed = 300;
  @Input() set value(value: number) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  @Output() changeValue = new EventEmitter<number>();

  interval: any;

  paused = true;

  constructor() { }

  ngOnInit(): void {
  }

  play(): void {
    if (!this.paused) { return; }
    this.paused = false;

    this.interval = setInterval(() => {
      if (this.value < this.max) {
        this.value += this.step;
        this.changeValue.emit(this.value);
      } else {
        clearInterval(this.interval);
      }
    }
    , this.speed);
  }

  pause(): void {
    this.paused = true;
    clearInterval(this.interval);
  }

  toggle(): void {
    this.paused ? this.play() : this.pause();
  }

  onChangeValue(event: any) {
    const value = +event.target.value;
    this.value = value;
    this.changeValue.emit(value);
  }

}
