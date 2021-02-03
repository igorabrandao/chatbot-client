// Angular components
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

// Interfaces
import { Wallet } from '../../interfaces/wallet';

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/wallet'
})
export class TransactionService extends BaseService {

    /**
     * Register a new wallet
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/register-wallet',
        skipAuthorization: true
    })
    registerWallet: IResourceMethod<{ user_id: number, currency: string }, Wallet>;

    /**
     * Set a wallet as default
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/set-default-wallet',
        skipAuthorization: true
    })
    setDefaultWallet: IResourceMethod<{ code: string }, Wallet>;
}
