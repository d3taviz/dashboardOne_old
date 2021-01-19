import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.http.get<any>('http://dummy.restapiexample.com/api/v1/employees')
    .pipe(
      retry(3),
      map((answer) => answer.data)
    );
  }

  getParsedData(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' })
    .pipe(
      retry(3),
      map((csv) => d3.csvParse(csv))
    );
  }

  getIris(): Observable<any> {
    const url = 'https://raw.githubusercontent.com/d3taviz/dashboardOne/scatterplot-init/src/assets/iris.csv';
    return this.getParsedData(url);
  ;
  }
}
