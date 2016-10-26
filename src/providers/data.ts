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
  formattedObservations: any;

  constructor(private http: Http) {}

  getLatestObservation(): any {
      //Return a default set of results;
      return {temp: "Loading...", time: "Loading...", type: "sunny.svg"};
  }

 formatObservation(data): any {
      this.formattedData = {time: '', temp: '', type: ''};
      // Time
      var date = new Date(data.dataDate);
      this.formattedData.time = this.formatTime(date);
      // Get latest data record
      var latestData = data.Location.Period.slice(-1)[0].Rep.slice(-1)[0];
      // Temperature
     this.formattedData.temp =  this.formatTemp(latestData.T);
      // Weather icons
      this.formattedData.type = this.formatType(latestData.W);
    
      console.log('Formatted data: ' + this.formattedData.time, this.formattedData.temp, this.formattedData.type );

      // Return formatted json data
      return this.formattedData;
 }

  formatRecentObservations(data): any {
      this.formattedObservations = [];
      
      // Get second latest data record
      var step;
      for (step = -2; step > -7; step--) {
          var latestObs = data.Location.Period.slice(-1)[0].Rep.slice(step)[0];
          var date = new Date(data.dataDate);
          date.setHours(date.getHours() - ((step*-1)-1));
          this.formattedObservations.push({
            type: this.formatType(latestObs.W),
            temp: this.formatTemp(latestObs.T),
            time: this.formatTime(date)
          })
      }

      // Return formatted json data
      return this.formattedObservations;
  }

  formatTime(date): any {
      var ftime = "";
      if (date.getHours()> 11) {
          ftime = date.getHours()-12 + 'pm';
      } else {
          ftime = date.getHours() + 'am';
      }
      return ftime;
  }

  formatTemp(temp): any {
      var ftemp = "";
      ftemp = temp + "C"
      return ftemp;
  }

  formatType(type): any {
      var iconImage = "/";
      var ftype = ""
      switch (type) {
        case "1":
          ftype = iconImage + "sunny.svg";
          break;
        case "3":
          ftype = iconImage + "scatcloud.svg";
          break;
        case "7":
          ftype = iconImage + "lcloud.svg";
          break;
        case "8":
          ftype = iconImage + "dcloud.svg";
          break;
        case "9", "10", "13", "14", "16", "17", "19", "20", "21":
          ftype = iconImage + "rshower.svg";
          break;
        case "11", "12", "15":
          ftype = iconImage + "rain.svg";
          break;
        case "28", "29", "30":
          ftype = iconImage + "thunderstorm.svg";
          break;
        case "18", "17", "22", "23", "24", "25", "26", "27":
          ftype = iconImage + "snow.svg";
          break;
        case "5", "6":
          ftype = iconImage + "mist.svg";
          break;
        case "0":
          ftype = iconImage + "night-clear.svg";
          break;
        case "2":
          ftype = iconImage + "night-partlyclear.svg";
          break;
        case "NA":
          ftype = iconImage + "sunny.svg";
          break;
        default:
          ftype = iconImage + "sunny.svg";
      }
      return ftype;
  }


}
