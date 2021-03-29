import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Map, tileLayer, Marker, icon, point, latLng, DivIcon } from 'leaflet';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AlertController } from '@ionic/angular';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  locations = [
    
    {
      id:2,
      name:"Château de Beynac",
      description:"Le château de Beynac est situé sur la commune de Beynac-et-Cazenac, dans le département de la Dordogne (Périgord noir). Ce château est l'un des mieux conservés et l'un des plus réputés de la région. Il a été classé monument historique le 11 février 1944.\r\nCette construction médiévale, d'allure austère, perchée sur le haut d'un plateau calcaire domine le bourg sur la rive droite de la Dordogne. Le château présente la forme d'un quadrilatère irrégulier prolongé au sud par un bastion en éperon. Le sévère donjon, garni de créneaux, date du xiiie siècle. Protégé du côté du plateau par une double enceinte, le château surplombe la Dordogne de 150 m.",
      longitude:"1.1455594789003953",
      latitude:"44.84013402499049",
      category:{
        id:1,
        name: "Monument",
        tag:"monument",
        color:{
          id:4,
          name:"Violet",
          hex:"#9c27b0",
          active: true
        },
      },
      active:true,
      distance:"6503.65869043482"
    },
    {
      id:4,
      name:"Musée de l'Histoire vivante",
      description:"Le musée de l'Histoire vivante est un musée historique situé à Montreuil-sous-bois, dans le Parc Montreau (31 boulevard Théophile-Sueur).\n\nCréé en 1937 par l'Association pour l'Histoire Vivante sous l'impulsion de Jacques Duclos, il ouvre ses portes le 23 mars 1939 pour le 150e anniversaire de la Révolution française. Sa direction est alors confiée à Jean Bruhat. Il traite alors de l'histoire des mouvements sociaux, de la colonisation et de la décolonisation, ainsi que de la banlieue et du patrimoine industriel de la ville de Montreuil. Son domaine s'est élargi depuis, notamment au travers des expositions temporaires.",
      longitude:"2.4718159085841767",
      latitude:"48.86601006762586",
      category:{
        id:2,
        name:"Musée",
        tag:"musée",
        color:{
          id:6,
          name:"Gris",
          hex:"#009688",
          active:true
        },
        active:true
      },
      active:true,
      distance:"6686.237658761102"
    },
    {
          id:1,
          name:"Château de Montmirail",
          description:"Le château est bâti sur une motte castrale (ou une tour de bois sur un mont). C'est au ixe siècle que ce que l'on nomme un « château fort » est attesté à Montmirail. C'est durant cette période qu'ont lieu les invasions normandes (vikings). Une résistance se met en place autour des possessions de l'évêché de Chartres, dont font partie les terres de Montmirail. Pour « service rendu », l'évêque de Chartres fait don des terres du château à la famille Gouët, qui reste en possession des terres pendant près de six cents ans. Cette petite province du Perche est nommée « Perche Gouët », elle est constituée de 35 paroisses et 5 baronnies : Alluye-La-Belle, Montmirail-La-Superbe, la Bazoche-La-Gaillarde, Brou-La-Riche et Authon-La-Pouilleuse.\r\n\r\nC'est sous l'un des descendants de Guillaume Gouët, en 1169, que le château accueille la rencontre entre le roi de France Louis VII le Jeune, Henri II Plantagenêt, roi d'Angleterre et Thomas Becket, archevêque de Canterbury. Les deux rois ont en commun la même épouse : en premières noces, Aliénor d'Aquitaine avait épousé le roi de France puis avait rompu ses noces pour se remarier avec Henri II Plantagenêt le roi d'Angleterre. Le royaume de France n'est alors plus qu'une enclave dans le royaume anglais. Le site de Montmirail est, de ce fait, idéalement situé pour accueillir les deux souverains, puisqu'il est à la frontière entre les deux territoires.",
          longitude:"0.7902696553446731",
          latitude:"48.10320065447777",
          category:{
             id:1,
             name:"Monument",
             tag:"monument",
             color:{
                id:4,
                name:"Violet",
                hex:"#9c27b0",
             },             
          },
       distance:"6734.7978786047515"
    }
 ];
  latitude = 2.3488;
  longitude = 48.8534;
  categories;
  filters = [];
  map;

  constructor(private loaderService: LoaderService, private alertController: AlertController, private apiService: ApiService, private storage: Storage, private router: Router, private platform: Platform, private androidPermissions: AndroidPermissions, private geolocation: Geolocation) { }

  ngOnInit() {
    if(this.platform.is('mobile')){
      this.checkGeoPermission();
    }else{
      this.initDone();
    }
  }

  prepareLocationArray(locations){
    let finalArray = [];
    locations.forEach(element => {
      let object;
      if(element.id){
        object = element;
      }else{
        object = element[0];
        object.distance = element.distance;
      }
      
      finalArray.push(object);
    });
    return finalArray;
  }

  navigateToLocation(location){
    this.router.navigateByUrl('/menu/locations/location/' + location.id, {queryParams: { id: location.id}});
  }

  

  

  requestCategories(){
    this.apiService.get(`category/list`).subscribe((res) => {
      this.categories = res;
      console.log(this.categories);
    }, (error) => {
      console.log(error);
    })
  }

  requestNearestLocations(event){
    this.loaderService.presentLoading();
    this.apiService.get(`location/nearest/${this.longitude}/${this.latitude}`).subscribe((res) => {
      this.locations = this.prepareLocationArray(res);
      this.putMarkers();
      this.loaderService.dismiss();
      
    }, (error) => {
      console.log(error);
      console.log('Error', error);
      this.loaderService.dismiss();
    });

    if(event){
      event.target.complete();
    }
  }

  putMarkers(){
    this.locations.forEach(location => {
      let marker = new Marker([parseFloat(location.latitude), parseFloat(location.longitude)], {
        icon: new DivIcon({
          className: 'map-icon',
          html: `<div class="icon-container"><span class="icon"><?xml version="1.0" encoding="utf-8"?><svg style="width: 60px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" xml:space="preserve"><path fill="${location.category.color.hex}" class="path1" d="M8 2.1c1.1 0 2.2 0.5 3 1.3 0.8 0.9 1.3 1.9 1.3 3.1s-0.5 2.5-1.3 3.3l-3 3.1-3-3.1c-0.8-0.8-1.3-2-1.3-3.3 0-1.2 0.4-2.2 1.3-3.1 0.8-0.8 1.9-1.3 3-1.3z"></path><path fill="#fff" class="path2" d="M8 15.8l-4.4-4.6c-1.2-1.2-1.9-2.9-1.9-4.7 0-1.7 0.6-3.2 1.8-4.5 1.3-1.2 2.8-1.8 4.5-1.8s3.2 0.7 4.4 1.9c1.2 1.2 1.8 2.8 1.8 4.5s-0.7 3.5-1.8 4.7l-4.4 4.5zM4 10.7l4 4.1 3.9-4.1c1-1.1 1.6-2.6 1.6-4.2 0-1.5-0.6-2.9-1.6-4s-2.4-1.7-3.9-1.7-2.9 0.6-4 1.7c-1 1.1-1.6 2.5-1.6 4 0 1.6 0.6 3.2 1.6 4.2v0z"></path><path fill="#fff" class="path3" d="M8 16l-4.5-4.7c-1.2-1.2-1.9-3-1.9-4.8 0-1.7 0.6-3.3 1.9-4.6 1.2-1.2 2.8-1.9 4.5-1.9s3.3 0.7 4.5 1.9c1.2 1.3 1.9 2.9 1.9 4.6 0 1.8-0.7 3.6-1.9 4.8l-4.5 4.7zM8 0.3c-1.6 0-3.2 0.7-4.3 1.9-1.2 1.2-1.8 2.7-1.8 4.3 0 1.7 0.7 3.4 1.8 4.5l4.3 4.5 4.3-4.5c1.1-1.2 1.8-2.9 1.8-4.5s-0.6-3.1-1.8-4.4c-1.2-1.1-2.7-1.8-4.3-1.8zM8 15.1l-4.1-4.2c-1-1.2-1.7-2.8-1.7-4.4s0.6-3 1.7-4.1c1.1-1.1 2.6-1.7 4.1-1.7s3 0.6 4.1 1.7c1.1 1.1 1.7 2.6 1.7 4.1 0 1.6-0.6 3.2-1.7 4.3l-4.1 4.3zM4.2 10.6l3.8 4 3.8-4c1-1 1.6-2.6 1.6-4.1s-0.6-2.8-1.6-3.9c-1-1-2.4-1.6-3.8-1.6s-2.8 0.6-3.8 1.6c-1 1.1-1.6 2.4-1.6 3.9 0 1.6 0.6 3.1 1.6 4.1v0z"></path></svg></span></div>`,
          iconSize: [60, 42],
        })
      });
      marker.bindPopup(`<h3>${location.name}</h3>`);
      marker.addTo(this.map);
    });
  }

  removeMarkers(){
    this.map.eachLayer(layer => {
      if(layer instanceof Marker){
        this.map.removeLayer(layer);
      }
    })
  }

  checkGeoPermission(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      (result) => {
        if(result.hasPermission){
          this.getCoordonate();
        }else{
          this.askPermission();
        }
      }, (error) => {
        console.log('Error', error);
      })
  }

  askPermission(){
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      () => {
        this.getCoordonate();
      }, (error) => {
        console.log(error);
      }
    )
  }

  getCoordonate(){
    this.geolocation.getCurrentPosition().then((success) =>{
      console.log(success);
    }).catch((error) => {
      console.log(error);
    });
  }

  initDone(){
    this.map = new Map('map').setView([this.longitude, this.latitude], 9);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a target="_blank" href="https://www.mapbox.com/">Mapbox</a>',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);
    
    setTimeout(() => {
      this.map.invalidateSize();
      if(this.platform.is('mobile')){
        this.locations = this.prepareLocationArray(this.locations);
        this.putMarkers();
      }else{
        this.requestNearestLocations(null);
        this.requestCategories();
      }
      
      this.map.on('click', (e) => {
        console.log(e)
      });
    })
  }

  prepareFilter(){
    this.categories.forEach(category => {
      let filter = {
        name: category.tag,
        type: 'checkbox',
        label: category.name,
        value: category.id,
        checked: true
      };
      if(!this.filters.some(index => index.value == filter.value)){
        this.filters.push(filter);
      }
    })
  }

  showFilter(){
    this.prepareFilter();
    this.presentAlert();
  }

  letsRide(){
    console.log('Lets ride');
  }

  navigateList(){
    this.router.navigateByUrl('/menu/home/home-list');
  }

  async presentAlert(){
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: 'Filtrer',
      inputs: this.filters,
      buttons: [
        {
          text: 'Valider',
          handler: (data) => {
            this.handleFilters(data);
            console.log(data);
          }
        },
        {

          text: 'Annuler',
          role: 'cancel',
        }
      ]
    });
    await alert.present();
  }

  handleFilters(data){
    this.loaderService.presentLoading();
    if(data.length){
      let tmpFilter = [];
      this.filters.forEach(function(filter){
        if(!data.includes(filter.value)){
          filter.checked = false;
        }else{
          filter.checked = true;
          tmpFilter.push(filter.value);
        }
      });
      this.apiService.post(`location/list`, tmpFilter).subscribe((res) => {
        this.removeMarkers();
        this.locations = this.prepareLocationArray(res);
        this.putMarkers();
        this.loaderService.dismiss();
      }, (error) => {
        console.log(error);
        this.loaderService.dismiss();
      })
    }else{
      this.requestNearestLocations(null);
    }
  }

}
