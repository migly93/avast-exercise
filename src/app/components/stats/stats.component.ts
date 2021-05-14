import { Stats } from './../../models/stats';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as data from '../../../assets/task.recording.json';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor() { }

  jsonRecords = data.records;

  displayedColumns: string[] = ['events', 'minTimeDelay', 'maxTimeDelay', 'meanTimeDelay', 'longestInputAfterFocusSeq', 'totalInteractionTime', 'longestFocusTime', 'totalClicks'];
  dataSource = new MatTableDataSource<Stats>();

  ngOnInit(): void {

    const stats: Stats = {
      events: this.getEventsSet().size,
      minTimeDelay: this.getMinTimeDelay(),
      maxTimeDelay: this.getMaxTimeDelay(),
      meanTimeDelay: this.getMeanTimeDelay(),
      longestInputAfterFocusSeq: this.getLongestSequence('focus', 'input'),
      totalInteractionTime: this.getTotalInteractionTime(),
      longestFocusTime: this.getLongestEventTime('focus'),
      totalClicks: this.getTotalNumberOfEvent('click')
    };

    this.dataSource.data = [stats];
  }

  getEventsSet = () => {
    const events: string[] = this.jsonRecords.map(record => record.event.type);
    return new Set(events);
  }

  getMinTimeDelay = (): number => {
    // tslint:disable-next-line: curly
    if (this.jsonRecords.length <= 1) return 0;

    let minTimeDelay = this.jsonRecords[1].time - this.jsonRecords[0].time;
    this.jsonRecords.slice(2).forEach((actual, i) => {
      const delay = actual.time - this.jsonRecords[i + 1].time;
      minTimeDelay = minTimeDelay < delay ? minTimeDelay : delay;
    });
    return minTimeDelay /= 1000;
  }

  getMaxTimeDelay = (): number => {
    // tslint:disable-next-line: curly
    if (this.jsonRecords.length <= 1) return 0;

    let maxTimeDelay = this.jsonRecords[1].time - this.jsonRecords[0].time;
    this.jsonRecords.slice(2).forEach((actual, i) => {
      const delay = actual.time - this.jsonRecords[i + 1].time;
      maxTimeDelay = maxTimeDelay > delay ? maxTimeDelay : delay;
    });
    return maxTimeDelay /= 1000;
  }

  getMeanTimeDelay = (): number => {
    // tslint:disable-next-line: curly
    if (this.jsonRecords.length <= 1) return 0;

    let totalDelay = 0;
    this.jsonRecords.slice(1).forEach((actual, i) => totalDelay += actual.time - this.jsonRecords[i].time);
    let meanTimeDelay = totalDelay / this.jsonRecords.length;
    return meanTimeDelay /= 1000;
  }

  getLongestSequence = (eventTrigger: string, eventToCount: string): number => {
    let longestSequence = 0;
    let actualSequence = 0;
    let canCountNext = false;
    this.jsonRecords.forEach(elem => {
      const isTrigger = elem.event.type === eventTrigger;
      const canCount = elem.event.type === eventToCount;
      longestSequence = longestSequence < actualSequence ? actualSequence : longestSequence;
      // tslint:disable-next-line: curly
      if (canCount && canCountNext) actualSequence++;
      else {
        canCountNext = isTrigger;
        actualSequence = 0;
      }
    });
    return longestSequence;
  }

  getTotalInteractionTime = (): string => {
    const length = this.jsonRecords.length;
    const totalInteractionTime = this.jsonRecords[length - 1].time - this.jsonRecords[0].time;
    return this.getTimeString(totalInteractionTime);
  }

  getLongestEventTime = (event: string): string => {
    let longestEventTime = 0;
    this.jsonRecords.slice(2).forEach((elem, i) => {
      const previous = this.jsonRecords[i + 1];
      if (previous.event.type === event) {
        const focusTime = elem.time - previous.time;
        longestEventTime = longestEventTime > focusTime ? longestEventTime : focusTime;
      }
    });
    return this.getTimeString(longestEventTime);
  }

  getTimeString = (millis: number): string => {
    return new Date(millis).toISOString().slice(11, -1);
  }

  getTotalNumberOfEvent = (event: string): number => {
    return this.jsonRecords.filter(elem => elem.event.type === event).length;
  }

}
