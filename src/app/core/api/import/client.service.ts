import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

/**
 Class for the ImportService.
 */
@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/imports'
})
export class ImportService extends BaseService {

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/import-company-products'
    })
    importCompanyProducts: IResourceMethod<any, any>;

}
