// Angular components
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

// Interfaces
import { Transaction } from '../../interfaces/transaction';

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/transaction'
})
export class TransactionService extends BaseService {

    /**
     * Convert currencies
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/convert-currency',
        skipAuthorization: true
    })
    convertCurrency: IResourceMethod<{ from_currency: string, to_currency: string, amount: number }, Transaction>;
}
