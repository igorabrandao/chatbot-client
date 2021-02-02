import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

/**
 Class for the WirecardService.
 */

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/wirecard'
})
export class WirecardService extends BaseService {

    @ResourceAction({
        method: ResourceRequestMethod.Get,
        path: '/get-permission-request-uri'
    })
    getPermissinRequestUri: IResourceMethod<any, any>;
}
