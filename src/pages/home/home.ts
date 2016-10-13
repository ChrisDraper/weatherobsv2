import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import {Data} from '../../providers/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	observations: any;
  latestObs: any;

  
  cityid: string;
  appid: string;

	constructor(public navCtrl: NavController, public dataService: Data, private http: Http, public alertCtrl: AlertController) {

    // Latest observation
    this.latestObs = this.dataService.getLatestObservation();
    
    this.cityid = '2652318';
    this.appid = '93d084a13ebef466e99ba2ccda6458f7';
    this.http.get('http://api.openweathermap.org/data/2.5/weather?lat=51.431443&lon=-2.189674&units=metric&APPID=' + this.appid)
              .map(res => res.json())
              .subscribe(
                  data => {
                    this.latestObs = this.dataService.formatObservation(data);
                  },
                  error => {
                      this.showConectionErrAlert();
                  });

    // Recent observations (After the latest observation)
		this.observations = this.dataService.getRecentObservations();

	}

  showConectionErrAlert() {
      let alert = this.alertCtrl.create({
        title: 'Oh bother!!',
        subTitle: 'Connection to latest data is unavailable.',
        buttons: ['FAIR ENOUGH']
      });
      alert.present();
  }

}

