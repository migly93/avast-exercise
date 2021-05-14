import { TableRecord } from './../../models/table-record';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import * as data from '../../../assets/task.recording.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  constructor() {}

  displayedColumns: string[] = ['eventType', 'htmlTag', 'date', 'actions'];
  dataSource = new MatTableDataSource<TableRecord>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.data = this.getTableRecords();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 0);
  }

  getTableRecords = (): TableRecord[] => {
    return data.records
      .filter(record => record.event.type)
      .map((record, index) => {
        return {
          eventType: record.event.type,
          htmlTag: record.setup.nodeName ? record.setup.nodeName : '',
          date: new Date(record.time),
          originalIndex: index
        };
      });
  }

  onDelete = (element: TableRecord) => {
    this.dataSource.data = this.dataSource.data.filter(i => i !== element);
  }

  exportJson(): void {
    const jsonString = JSON.stringify(this.getDownloadData());
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString));
    element.setAttribute('download', 'task-rec.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  getDownloadData = () => {
    const baseJsonRecords = data.records;
    const tableData = this.dataSource.data;
    const toDownload: typeof baseJsonRecords = [];
    // tslint:disable-next-line: curly
    for (let i = tableData.length - 1; i >= 0; i--)
      toDownload.push(baseJsonRecords[tableData[i].originalIndex]);
    return toDownload;
  }
}
