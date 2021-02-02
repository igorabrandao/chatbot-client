import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

/**
 Class for the PaymentService.
 */

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/payments'
})
export class PaymentService extends BaseService {

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/perform-payment'
    })
    performPayment: IResourceMethod<any, any>;
}
