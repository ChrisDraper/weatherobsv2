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
  location: any;

  
  locationid: string;
  appid: string;

	constructor(public navCtrl: NavController, public dataService: Data, private http: Http, public alertCtrl: AlertController) {
    
    this.appid = 'c52882f0-643b-4821-ad25-f2b8862ce289';
    //this.dataService.saveLocation('3740'); // Lyneham
    //this.dataService.saveLocation('3081'); // Braemar
    //this.dataService.saveLocation('3047'); // Tulloch Bridge
    //this.dataService.saveLocation('3658'); // Benson
    this.dataService.getLocation().then((result) => {
      if(result){
        console.log('locationid: ' + result);
        this.locationid = result; 
        this.location = {id : this.locationid};
       } else {
         console.log('no result default: 3740' );
         this.locationid = '3740';
       }

     this.refreshObs();
      // Latest observation   
    });

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
     this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/' + this.locationid + '?res=hourly&key=' + this.appid)
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
     this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/' + this.locationid + '?res=hourly&key=' + this.appid)
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

  sideMenu() {
    this.dataService.saveLocation('3658');
    this.locationid = '3658';
      let alert = this.alertCtrl.create({
        title: 'Benson',
        subTitle: 'Station set to Benson',
        buttons: ['RIGHTO']
      });
      alert.present();
      this.refreshObs();
  }

  searchLocation() {
      this.dataService.saveLocation('3047');
      this.locationid = '3047';
      let alert = this.alertCtrl.create({
        title: 'Tulloch Bridge',
        subTitle: 'Station set to Tulloch Bridge',
        buttons: ['WE\'RE DOOMED']
      });
      alert.present();
      this.refreshObs();
  }

  findLocation() {
  }

}

