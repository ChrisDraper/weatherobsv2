import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import {Data} from '../../providers/data';
import { Search } from '../../pages/search/search';
import { Favourites } from '../../pages/favourites/favourites';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	observations: any;
  latestObs: any;
  obsVerify: any;
  lastUpdated: any;
  location: any;

  
  locationid: string;
  appid: string;


	constructor(public navCtrl: NavController, public navParams: NavParams, public dataService: Data, private http: Http, public alertCtrl: AlertController, private toastCtrl: ToastController) {
    
    this.appid = 'c52882f0-643b-4821-ad25-f2b8862ce289';
    if (this.navParams.get('location')){
      console.log('Location load: ' + this.navParams.get('location').locationid);
      this.locationid = this.navParams.get('location').locationid;
      this.dataService.saveLocation(this.locationid);
      this.refreshObs();
    } else {    
      this.dataService.getLocation().then((result) => {
          if(result){
            console.log('Data storage load: ' + result);
            this.locationid = result; 
            this.dataService.saveLocation(this.locationid);
            this.refreshObs();
          } else {
            this.searchLocation();
          }  
        });

    }


	}

  

  ionViewDidLoad() {
      //this.testloc = this.navParams.get('location');
      //this.locationid = this.testloc.locationid;
      //this.refreshObs();
      //console.log(this.navParams.get('location'));
  }

  refreshObs() {
     this.presentToast('Fetching weather report...', 'top');
     this.http.get('http://datapoint.metoffice.gov.uk/public/data/val/wxobs/all/json/' + this.locationid + '?res=hourly&key=' + this.appid)
              .map(res => res.json())
              .subscribe(
                  data => {
                    this.dataService.saveLastUpdateTime();
                    setTimeout(() => {
                      this.obsVerify = this.dataService.formatObservation(data.SiteRep.DV);
                      if (this.obsVerify.station){
                        this.latestObs = this.obsVerify;
                        this.observations = this.dataService.formatRecentObservations(data.SiteRep.DV);
                        this.displayLastUpdateTime();
                      } else {
                        this.observations = [];
                        this.latestObs = null;
                        this.presentToast('No data was returned from station (ID: ' + this.locationid + ')','middle');
                      }
                    }, 1500);
                  },
                  error => {
                    console.log(error);
                      this.presentToast('No connection found', 'middle');
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
                        this.displayLastUpdateTime(); this.obsVerify = this.dataService.formatObservation(data.SiteRep.DV);
                        if (this.obsVerify.station){
                          this.latestObs = this.obsVerify;
                          this.observations = this.dataService.formatRecentObservations(data.SiteRep.DV);
                          this.displayLastUpdateTime();
                        } else {
                          this.presentToast('No data was returned from station (ID: ' + this.locationid + ')','middle');
                          this.observations = [];
                          this.latestObs = null;
                        }
                    }, 2000);
                  },
                  error => {
                    setTimeout(() => {
                        this.presentToast('No connection found', 'middle');
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

 

  showFavourites() {
     this.navCtrl.push(Favourites, {});
  }

  searchLocation() {
     this.navCtrl.push(Search, {});
  }

 

  presentToast(message, position) {
    let toast = this.toastCtrl.create({
        message: message,
        duration: 2000,
        position: position
    });
    toast.present();
  } 

}

