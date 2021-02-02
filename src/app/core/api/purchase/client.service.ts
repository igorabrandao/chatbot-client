import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod} from '@ngx-resource/core';

/**
 Class for the PurchaseService.
 */

// export interface IPurchase {
//     id?: number;
//     name?: string;
//     brand_name?: string;
//     description?: string;
//     imagem_url?: string;
//     bula_url?: string;
//     created_at?: string;
//     updated_at?: string;
// }

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/purchases'
})
export class PurchaseService extends BaseService {

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
        path: '/company-review-purchases',
        isArray: true,
        skipLoading: true
    })
    companyReviewPurchases: IResourceMethod<any, any[]>;

    @ResourceAction({
        path: '/company-purchases',
        isArray: true,
        skipLoading: true
    })
    companyPurchases: IResourceMethod<any, any[]>;

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/reject-purchase'
    })
    rejectPurchase: IResourceMethod<any, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Delete,
        path: '/{!id}'
    })
    remove: IResourceMethod<{ id: any }, any>;
}
