import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {

  data: any;
  formattedData: any;
  formattedObservations: any;

  constructor(private http: Http, public storage: Storage) {}


  getLocation(): Promise<any> {
      return this.storage.get('locationid'); 
  }

  saveLocation(locationid): void {
    this.storage.set('locationid', locationid);
  }

 formatObservation(data): any {
      this.formattedData = {};
      if (data.Location) { // Have data
        // Time
        var date = new Date(data.dataDate);
        this.formattedData.time = this.formatTime(date);

        // Get latest data record
        var latestData = data.Location.Period.slice(-1)[0].Rep.slice(-1)[0];
        // Temperature
      this.formattedData.temp =  this.formatTemp(latestData.T);
        // Weather icons
        this.formattedData.type = this.formatType(latestData.W);
        // Weather type description
        this.formattedData.typeDesc = this.formatTypeDesc(latestData.W);
        // Wind speed
        this.formattedData.windSpeed = this.formatWindSpeed(latestData.S); 
        // Wind direction
        this.formattedData.windDirection = this.formatWindDirection(latestData.D); 
        // Pressure
        this.formattedData.pressure = this.formatPressure(latestData.P); 
        // Dew point
        this.formattedData.dewPoint = this.formatDewPoint(latestData.Dp);
        // Station 
        this.formattedData.station = this.toTitleCase(data.Location.name);
      } 
      // Return formatted json data
      return this.formattedData;
 }

  formatRecentObservations(data): any {
      this.formattedObservations = [];
      if (data.Location) {
        // Get second latest data record
        //typeDesc: '', windSpeed: '', windDirection: '', pressure: '', dewPoint: ''
        var step;
        for (step = -2; step > -14; step--) {
            var latestObs = data.Location.Period.slice(-1)[0].Rep.slice(step)[0];
            var date = new Date(data.dataDate);
            date.setHours(date.getHours() - ((step*-1)-1));
            this.formattedObservations.push({
              type: this.formatType(latestObs.W),
              temp: this.formatTemp(latestObs.T),
              time: this.formatTime(date),
              typeDesc: this.formatTypeDesc(latestObs.W),
              windSpeed: this.formatWindSpeed(latestObs.S),
              windDirection: this.formatWindDirection(latestObs.D),
              pressure: this.formatPressure(latestObs.P),
              dewPoint: this.formatDewPoint(latestObs.Dp)
            })
        }
      }

      // Return formatted json data
      return this.formattedObservations;
  }

  formatWindSpeed(speed): any {
      var ftemp = "";
      ftemp = speed + "mph";
      return ftemp;
  }

  formatWindDirection(direction): any {
      var fwdir = "";
      fwdir = direction;
      return fwdir;
  }

  formatPressure(pressure): any {
      var fpressure = "";
      fpressure = pressure + "mb";
      return fpressure;
  }

  formatTime(date): any {
      var ftime = "";
      if (date.getHours()> 11) {
          if (date.getHours()==12) {
            ftime = '12pm';
          } else {
            ftime = date.getHours()-12 + 'pm';
          }
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
      var iconImage = "";
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

  formatTypeDesc(type): any {
      var ftypedesc = ""
      switch (type) {
        case "0":
          ftypedesc =  "Clear";;
          break
        case "1":
          ftypedesc =  "Sunny";
          break;
        case "2","3":
          ftypedesc =  "Partly cloudy";
          break;
        case "5":
          ftypedesc =  "Mist";
          break;
        case "6":
          ftypedesc =  "Fog";
          break;
        case "7":
          ftypedesc =  "Cloudy";
          break;
        case "8":
          ftypedesc =  "Overcast";
          break;
        case "9","10":
          ftypedesc =  "Light rain shower";
          break;
        case "11":
          ftypedesc =  "Drizzle";
          break;
        case "12":
          ftypedesc =  "Light rain";
          break;
        case "13","14":
          ftypedesc =  "Heavy rain shower";
          break;
        case "15":
          ftypedesc =  "Heavy rain";
          break;
        case "16","17":
          ftypedesc =  "Sleet shower";
          break;
        case "18":
          ftypedesc =  "Sleet";
          break;
        case "19","20":
          ftypedesc =  "Hail shower";
          break;
        case "21":
          ftypedesc =  "Sleet";
          break;
        case "22","23":
          ftypedesc =  "Light snow shower";
          break;
        case "24":
          ftypedesc =  "Light snow";
          break;
        case "25","26":
          ftypedesc =  "Heavy snow shower";
          break;
        case "27":
          ftypedesc =  "Heavy snow";
          break;
        case "28","29":
          ftypedesc =  "Thunder shower";
          break;
        case "30":
          ftypedesc =  "Thunder";
          break;
        default:
          ftypedesc =  "";
      }
      return ftypedesc;
  }

  formatDewPoint(dptemp): any {
      var fdtemp = "";
      fdtemp = "Dew point " + dptemp + "C"
      return fdtemp;
  }

  getLastUpdateTime() {
    return this.storage.get('lastupdated');  
  }
 
  saveLastUpdateTime(){
    var updated = new Date();
    this.storage.set('lastupdated', updated);
  }

  formatLastUpdated(date) {
    var updated = new Date(date);
    var updatedMins = updated.getMinutes().toString();
    if (updated.getMinutes()<10) {
      updatedMins = '0' + updatedMins;
    }
    
    return "Updated " + updated.getHours() + ":" + updatedMins + "" ;
  }

  toTitleCase(str)
  {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

}
