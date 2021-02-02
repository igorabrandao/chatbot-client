import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod} from '@ngx-resource/core';

/**
 Class for the CompanyService.
 */

export interface ICompany {
    id?: number;
    name?: string;
    cnpj?: string;
    business_category?: number;
    wirecard_token?: string;
    created_at?: string;
    updated_at?: string;
    delivery_radius?: number;
    delivery_price?: string;
    open_delivery_time?: string;
    photo_url?: string;
    status_on_system?: number;
}

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/companies'
})
export class CompanyService extends BaseService {

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

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/open-store'
    })
    openStore: IResourceMethod<any, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/close-store'
    })
    closeStore: IResourceMethod<any, any>;
}
