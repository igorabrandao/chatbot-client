import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { } from '@types/googlemaps';

/**
 Class for the GmapsService.
 */

const key = 'AIzaSyB-t9h9gmsR_mn87hs7FGX6C-40nAuBDIM';

@Injectable()
@ResourceParams({
    url: 'https://maps.googleapis.com/maps/api'
})
export class GmapsService extends BaseService {

    geocoder = new google.maps.Geocoder();

    @ResourceAction({
        method: ResourceRequestMethod.Get,
        path: '/geocode/json?address={!address}&key=' + key
    })
    getGeocoding: IResourceMethod<{address: any}, any>;

    /**
     * Geocoding service.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param address The address to be searched
     * @return An observable of GeocoderResult
     */
    codeAddress(address: string): Observable<google.maps.GeocoderResult[]> {
        return Observable.create((observer: Observer<google.maps.GeocoderResult[]>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.geocoder.geocode({ address: address }, (
                (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        observer.next(results);
                        observer.complete();
                    } else {
                        console.log(
                            'Geocoding service: geocode was not successful for the following reason: '
                            + status
                        );
                        observer.error(status);
                    }
                })
            );
        });
    }
}
