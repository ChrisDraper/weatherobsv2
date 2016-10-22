import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {

  data: any;
  cityid: string;
  appid: string;
  formattedData: any;

  constructor(private http: Http) {}

  getLatestObservation(): any {
      //Return a default set of results;
      return {temp: "Loading...", time: "Loading...", type: "sunny.svg"};
  }

 formatObservation(data): any {
      this.formattedData = {time: '', temp: '', type: ''};
      // Time
      var date = new Date(data.dataDate);
      if (date.getHours()> 11) {
          this.formattedData.time = date.getHours()-12 + 'pm';
      } else {
          this.formattedData.time = date.getHours() + 'am';
      }
      // Get latest data record
      var latestData = data.Location.Period.slice(-1)[0].Rep.slice(-1)[0];
      // Temperature
     this.formattedData.temp =  latestData.T + "C";
      // Weather icons
   
      var iconImage = "/";
      switch (latestData.W) {
        case "1":
          this.formattedData.type = iconImage + "sunny.svg";
          break;
        case "3":
          this.formattedData.type = iconImage + "scatcloud.svg";
          break;
        case "7":
          this.formattedData.type = iconImage + "lcloud.svg";
          break;
        case "8":
          this.formattedData.type = iconImage + "dcloud.svg";
          break;
        case "9", "10", "13", "14", "16", "17", "19", "20", "21":
          this.formattedData.type = iconImage + "rshower.svg";
          break;
        case "11", "12", "15":
          this.formattedData.type = iconImage + "rain.svg";
          break;
        case "28", "29", "30":
          this.formattedData.type = iconImage + "thunderstorm.svg";
          break;
        case "18", "17", "22", "23", "24", "25", "26", "27":
          this.formattedData.type = iconImage + "snow.svg";
          break;
        case "5", "6":
          this.formattedData.type = iconImage + "mist.svg";
          break;
        case "0":
          this.formattedData.type = iconImage + "night-clear.svg";
          break;
        case "2":
          this.formattedData.type = iconImage + "night-partlyclear.svg";
          break;
        case "NA":
          this.formattedData.type = iconImage + "sunny.svg";
          break;
        default:
          this.formattedData.type = iconImage + "sunny.svg";
      }
      console.log('Formatted data: ' + this.formattedData.time, this.formattedData.temp, this.formattedData.type );

      // Return formatted json data
      return this.formattedData;
 }

  getRecentObservations(): any {
    return [
            {type: 'snow.svg',
            temp: '-1.2C',
            time: '2PM'},
            {type: 'lsnow.svg',
            temp: '-1.1C',
            time: '1PM'},
            {type: 'dcloud.svg',
            temp: '-1.1C',
            time: '12PM'},
            {type: 'rain.svg',
            temp: '-1.1C',
            time: '11AM'},
            {type: 'lcloud.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'rshowers.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'thunderstorm.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'sunny.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'scatcloud.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'night-clear.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'night-partlyclear.svg',
            temp: '-1.0C',
            time: '10AM'},
            {type: 'mist.svg',
            temp: '-1.0C',
            time: '10AM'},
        ];
  }


}
