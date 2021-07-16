import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Parsed data, as input for VS component
  csvData = [];

  constructor(private papa: Papa) {
  }

  // Following 3 functions parse the
  // uploaded csv file and store the
  // column names and data
  parseCsvFile(file, callBack) {
    this.papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: "greedy",
      worker: true,
      complete: function(res) {
        callBack(res);
      }
    });
  }

  handleUpload($event: any) {
    const fileList = $event.srcElement.files;
    this.parseCsvFile(fileList[0], this.retrieveData.bind(this));
  }

  retrieveData(res) {
    this.csvData.push(res.meta.fields)
    for(let i = 0; i < 50; i++) {
      let array = [];
      for(let item in res.data[i]) {
        if(res.data[i][item] === null) {
          array.push("null");
        } else {
          array.push(res.data[i][item]);
        }
      }
      this.csvData.push(array);
    } 
  }

}
