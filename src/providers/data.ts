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
      return {temp: "Loading...", time: "Loading...", type: "images/sunny.svg"};
  }

 formatObservation(data): any {
      this.formattedData = {time: '', temp: '', type: ''};
      // Time
      var date = new Date(data.dt*1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var formattedTime = hours + ':' + minutes.substr(-2);
      this.formattedData.time = formattedTime;
      // Temperature
      this.formattedData.temp = data.main.temp + "C";
      // Weather icon
      //01d.png      01n.png      clear sky           
      //02d.png      02n.png      few clouds          
      //03d.png      03n.png      scattered clouds    
      //04d.png      04n.png      broken clouds       
      //09d.png      09n.png      shower rain         
      //10d.png      10n.png      rain                
      //11d.png      11n.png      thunderstorm        
      //13d.png      13n.png      snow                
      //50d.png      50n.png      mist                
      var iconImage = "/";
      switch (data.weather[0].icon) {
        case "01d":
          this.formattedData.type = iconImage + "sunny.svg";
          break;
        case "02d":
          this.formattedData.type = iconImage + "scatcloud.svg";
          break;
        case "03d", "03n":
          this.formattedData.type = iconImage + "lcloud.svg";
          break;
        case "04d", "04n":
          this.formattedData.type = iconImage + "dcloud.svg";
          break;
        case "09d", "09n":
          this.formattedData.type = iconImage + "rshower.svg";
          break;
        case "10d", "10n":
          this.formattedData.type = iconImage + "rain.svg";
          break;
        case "11d", "11n":
          this.formattedData.type = iconImage + "thunderstorm.svg";
          break;
        case "13d", "13n":
          this.formattedData.type = iconImage + "snow.svg";
          break;
        case "50d", "50n":
          this.formattedData.type = iconImage + "mist.svg";
          break;
        case "01n":
          this.formattedData.type = iconImage + "night-clear.svg";
          break;
        case "02n":
          this.formattedData.type = iconImage + "night-partlyclear.svg";
          break;
        default:
          this.formattedData.type = iconImage + "sunny.svg";
      }
      console.log('Data: ' + data.weather[0].icon, this.formattedData.type);

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
