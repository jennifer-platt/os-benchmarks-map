import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BenchmarkService {

  public benchmarkArray: Benchmark[] = [];

  constructor(private http: HttpClient) {}

  getBenchmarks(): Observable<Benchmark[]> {
    return this.http.get('york_benchmarks_to_plot.csv', { responseType: 'text' }).pipe(
      map(data => {
        const csvToRowArray = data.split("\n");
        const benchmarks: Benchmark[] = [];

        for (let index = 1; index < csvToRowArray.length; index++) {
          const row = csvToRowArray[index].split(",");
          if (row.length >= 11) {
            benchmarks.push(new Benchmark(
              parseInt(row[0]),
              row[1].trim(),
              parseFloat(row[2]),
              parseFloat(row[3]),
              row[4].trim(),
              parseFloat(row[5]),
              parseFloat(row[6]),
              parseFloat(row[7]),
              parseInt(row[8]),
              parseInt(row[9]),
              row[10].trim(),
              row[11].trim(),
              row[12].trim(),
              row[13].trim()
            ));
          }
        }

        return benchmarks;
      })
    );
  }
}

export class Benchmark {
  id: number;
  description: string;
  lat: number;
  lon: number;
  markType: string;
  accuracy: number;
  height: number;
  heightAboveGround: number;
  verifiedYear: number;
  levellingYear: number;
  status: string;
  dateFound: string;
  imageFilename: string;
  comments: string;

  constructor(id: number,
                description: string,
                lat: number,
                lon: number,
                markType: string,
                accuracy: number,
                height: number,
                heightAboveGround: number,
                verifiedYear: number,
                levellingYear: number,
                status: string,
                dateFound: string,
                imageFilename: string,
                comments: string
              ){
    this.id = id;
    this.description = description;
    this.lat = lat;
    this.lon = lon;
    this.markType = markType;
    this.accuracy = accuracy;
    this.height = height;
    this.heightAboveGround = heightAboveGround;
    this.verifiedYear = verifiedYear;
    this.levellingYear = levellingYear;
    this.status = status;
    this.dateFound = dateFound;
    this.imageFilename = imageFilename;
    this.comments = comments;
  }
}
