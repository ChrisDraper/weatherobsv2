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
  lastUpdated: any;

  
  cityid: string;
  appid: string;

	constructor(public navCtrl: NavController, public dataService: Data, private http: Http, public alertCtrl: AlertController) {
  
    // Latest observation
    //this.displayLastUpdateTime();
    this.latestObs = this.dataService.getLatestObservation();
    this.cityid = '3740'; // Lynehams
    this.appid = 'c52882f0-643b-4821-ad25-f2b8862ce289';
    this.refreshObs();

    // Resume app listener - buggy? May revisit when using local storage
    //document.addEventListener('resume', () => {
    //  this.resumeObs();
    //});

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
     this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/' + this.cityid + '?res=hourly&key=' + this.appid)
              .map(res => res.json())
              .subscribe(
                  data => {
                    this.dataService.saveLastUpdateTime();
                    setTimeout(() => {
                      this.latestObs = this.dataService.formatObservation(data.SiteRep.DV);
                      this.observations = this.dataService.formatRecentObservations(data.SiteRep.DV);
                      this.displayLastUpdateTime();
                    }, 1500);
                  },
                  error => {
                      this.showConectionErrAlert();
                  });
  }

  pullRefresh(refresher) {
    console.log('pullRefreshObs', refresher);
     this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/' + this.cityid + '?res=hourly&key=' + this.appid)
              .map(res => res.json())
              .subscribe(
                  data => {
                    this.dataService.saveLastUpdateTime();
                    setTimeout(() => {
                        refresher.complete();
                        this.latestObs = this.dataService.formatObservation(data.SiteRep.DV);
                        this.observations = this.dataService.formatRecentObservations(data.SiteRep.DV);
                        this.displayLastUpdateTime();
                    }, 2000);
                  },
                  error => {
                    setTimeout(() => {
                        this.showConectionErrAlert();
                        refresher.complete();
                    }, 2000);
                  });
  }

 resumeObs() {
      this.lastUpdated = 'Reloading...';
      setTimeout(() => {
        this.displayLastUpdateTime();
      }, 2000);
 }

  displayLastUpdateTime() {

    this.dataService.getLastUpdateTime().then((lastupdated) => {
 
      if(lastupdated){
        var date = new Date(lastupdated);
        this.lastUpdated = this.dataService.formatLastUpdated(date);
      }
 
    });
    
  }

}

