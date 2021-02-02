import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

/**
 Class for the LocationService.
 */

export interface ILocation {
    id?: number;
    street_number?: number;
    street_name?: string;
    locality?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    complement?: string;
    latitude?: number;
    longitude?: number;
    company_id?: number;
    user_id?: number;
    created_at?: string;
    updated_at?: string;
}

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/locations'
})
export class LocationService extends BaseService {

    @ResourceAction({
        method: ResourceRequestMethod.Post,
    })
    save: IResourceMethod<any, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Put,
        path: '/{!id}'
    })
    update: IResourceMethod<any, any>;

    @ResourceAction({
        path: '/{!id}'
    })
    get: IResourceMethod<any, any>;

    @ResourceAction({
        isArray: true
    })
    query: IResourceMethod<any, any[]>;

    @ResourceAction({
        method: ResourceRequestMethod.Delete,
        path: '/{!id}'
    })
    remove: IResourceMethod<{ id: any }, any>;
}
