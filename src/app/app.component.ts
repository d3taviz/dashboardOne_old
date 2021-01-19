import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DashboardOne';

  data1 = [125, 100, 50, 75, 200, 300, 100];
  data2$: Observable<any[]>;

  iris$: Observable<any>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.data2$ = this.api.getEmployees();
    this.iris$ = this.api.getIris();

    this.iris$.subscribe((c) => console.log(c));

    setTimeout(
      () => {
        console.log();

        this.data1 = [...this.data1, 600]; }
      , 5000
    )
  }
}
