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
    console.log('Home');
    // Latest observation
    this.latestObs = this.dataService.getLatestObservation();
    
    this.cityid = '3740'; // Lynehams
    this.appid = 'c52882f0-643b-4821-ad25-f2b8862ce289';
    this.refreshObs();

	}

  showConectionErrAlert() {
      let alert = this.alertCtrl.create({
        title: 'Oh bother!!',
        subTitle: 'Connection to latest data is unavailable.',
        buttons: ['FAIR ENOUGH']
      });
      alert.present();
  }

  refreshObs() {
    console.log('Refresh the API!!!');
     this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/' + this.cityid + '?res=hourly&key=' + this.appid)
              .map(res => res.json())
              .subscribe(
                  data => {
                    console.log(data.SiteRep.DV.dataDate);
                    this.latestObs = this.dataService.formatObservation(data.SiteRep.DV);
                    this.observations = this.dataService.formatRecentObservations(data.SiteRep.DV);
                  },
                  error => {
                      this.showConectionErrAlert();
                  });
  }

}

