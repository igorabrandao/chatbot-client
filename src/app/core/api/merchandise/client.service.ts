import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

/**
 Class for the MerchandiseService.
 */

export interface IMerchandise {
    id?: number;
    price?: string;
    quantity?: number;
    company_id?: number;
    product_id?: number;
}

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/merchandises'
})
export class MerchandiseService extends BaseService {

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
