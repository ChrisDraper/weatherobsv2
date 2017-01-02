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
  defaultLocations: Array<{title: string, locationid: any}>;
  defaultResults: Array<{title: string, locationid: any}>;

  constructor(private http: Http, public storage: Storage) {
    this.defaultLocations = [
              { title: 'Lyneham', locationid: '3740' },
              { title: 'Tulloch Bridge', locationid: '3047' },
              { title: 'Benson', locationid: '3658' }
            ];

    this.defaultResults = [
              { title: 'Lyneham', locationid: '3740' },
              { title: 'Tulloch Bridge', locationid: '3047' },
              { title: 'Benson', locationid: '3658' },
              { title: 'Heathrow', locationid: '3772' },
              { title: 'Lerwick', locationid: '3005' },
              { title: 'Aboyne', locationid: '3080' }
            ];
  }



 formatObservation(data): any {
      this.formattedData = {};
      if (data.Location) { // Have data
        //console.log(data.Location.Period);  
        //console.log(data.Location.Period.slice(-1));
        // Time
        var date = new Date(data.dataDate);
        this.formattedData.time = this.formatTime(date);

        // Get latest data record
        if (data.Location.Period[0]) {
          var latestData = data.Location.Period.slice(-1)[0].Rep.slice(-1)[0];
        } else {
          var latestData = data.Location.Period.Rep.slice(-1)[0];
        }
        
        // Temperature
        this.formattedData.temp =  this.formatTemp(latestData.T);
        // Weather icons
        this.formattedData.type = this.formatType(latestData.W);
        // Weather type description
        this.formattedData.typeDesc = this.formatTypeDesc(latestData.W);
        // Wind speed
        this.formattedData.windSpeed = this.formatWindSpeed(latestData.S); 
        // Wind direction
        this.formattedData.windDirection = this.formatWindDirection(latestData.S, latestData.D); 
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
        var step;
        var latestObs;
        var hoursCount;
        if (data.Location.Period[0]) {
          hoursCount = data.Location.Period.slice(-1)[0].Rep.length;
        } else {
          hoursCount = data.Location.Period.Rep.length; 
        }
        for (step = -2; step > (-1-hoursCount); step--) {
            latestObs = [];
            if (data.Location.Period[0]) {
              if (data.Location.Period.slice(-1)[0].Rep.slice(step)[0]) {
                latestObs = data.Location.Period.slice(-1)[0].Rep.slice(step)[0];
                //console.log(latestObs, step);
              }
            } else {
              if (data.Location.Period.Rep.slice(step)[0]) {
                latestObs = data.Location.Period.Rep.slice(step)[0];
                //console.log(latestObs, step);
              }
            }
            var date = new Date(data.dataDate);
            date.setHours(date.getHours() - ((step*-1)-1));
            this.formattedObservations.push({
              type: this.formatType(latestObs.W),
              temp: this.formatTemp(latestObs.T),
              time: this.formatTime(date),
              typeDesc: this.formatTypeDesc(latestObs.W),
              windSpeed: this.formatWindSpeed(latestObs.S),
              windDirection: this.formatWindDirection(latestObs.S, latestObs.D),
              pressure: this.formatPressure(latestObs.P),
              dewPoint: this.formatDewPoint(latestObs.Dp)
            })
        }
        // Check for previous day data
        if (data.Location.Period[0]) {
          hoursCount = data.Location.Period.slice(-2)[0].Rep.length+1;
          //console.log('hoursCount :  '  + hoursCount);
          for (step = -1; step > (-hoursCount); step--) {
              latestObs = [];
              latestObs = data.Location.Period.slice(-2)[0].Rep.slice(step)[0];
              var date = new Date(data.dataDate);
              //console.log(step);
              date.setHours(24 + step);
              this.formattedObservations.push({
                type: this.formatType(latestObs.W),
                temp: this.formatTemp(latestObs.T),
                time: this.formatTime(date),
                typeDesc: this.formatTypeDesc(latestObs.W),
                windSpeed: this.formatWindSpeed(latestObs.S),
                windDirection: this.formatWindDirection(latestObs.S, latestObs.D),
                pressure: this.formatPressure(latestObs.P),
                dewPoint: this.formatDewPoint(latestObs.Dp)
              })
          }
        }

      }

      // Return formatted json data
      return this.formattedObservations;
  }

  formatWindSpeed(speed): any {
      var fspeed = "";
      if (speed > 0){
        fspeed = speed + "mph";
      } else {
        fspeed = "Calm"
      }
      return fspeed;
  }

  formatWindDirection(speed, direction): any {
      var fwdir = "";
      if (speed > 0){
        fwdir = direction;
      }
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
            ftime = 'Midday';
          } else {
            ftime = date.getHours()-12 + 'pm';
          }
      } else {
          if (date.getHours()==0) {
            ftime = 'Midnight';
          } else {
            ftime = date.getHours() + 'am';
          }
          
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



  getLocation(): Promise<any> {
      return this.storage.get('locationid'); 
  }

  saveLocation(locationid): void {
    this.storage.set('locationid', locationid);
  }

  

  getLocationsList(): Promise<any> {
    return this.storage.get('locationList');
  }

  saveLocationList(locationList): void {
    this.storage.set('locationList', locationList);
  }

  addLocationToList(location): void {
      console.log('Saving location', location); 
      this.getLocationsList().then((result) => {
        if (result) {
          console.log('Adding to existing location list');
          // Check location not already in list
          console.log('Check', location, this.containsLocation(location, result))
          if (!this.containsLocation(location, result)) {
            result.push(location);
            console.log(result);
            this.saveLocationList(result);
          }
        } else {
            console.log('Adding to new location list');
            var newLocations: Array<{title: string, locationid: any}>;
            newLocations = [];
            newLocations.push(location);
            this.saveLocationList(newLocations);
        }
      }); 
  }

  containsLocation(location, list) {
      var i;
      for (i = 0; i < list.length; i++) {
          if (list[i].locationid == location.locationid) {
              return true;
          }
      }
      return false;
  }

// Search
  getSearchResults(text) {
    return this.defaultResults; // For now
  }

}
