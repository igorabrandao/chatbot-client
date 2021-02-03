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
export class WalletService extends BaseService {

    /**
     * Register a new wallet
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/register-wallet',
        skipAuthorization: false
    })
    registerWallet: IResourceMethod<{ user_id: number, currency: string }, Wallet>;

    /**
     * Set a wallet as default
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/set-default-wallet',
        skipAuthorization: false
    })
    setDefaultWallet: IResourceMethod<{ code: string }, Wallet>;

    /**
     * Check if the wallet already exists
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/check-wallet',
        skipAuthorization: false
    })
    checkWallet: IResourceMethod<{ user_id: number, currency: string }, Wallet>;

    /**
     * Check if the user already have a default wallet
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/check-default-wallet',
        skipAuthorization: false
    })
    checkDefaultWallet: IResourceMethod<{ user_id: number }, Wallet>;
}
