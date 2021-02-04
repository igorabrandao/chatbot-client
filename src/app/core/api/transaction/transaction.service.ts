// Angular components
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

// Interfaces
import { Transaction } from '../../interfaces/transaction';
import { Wallet } from '../../interfaces/wallet';

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

    /**
     * Deposit money
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/deposit-money',
        skipAuthorization: true
    })
    depositMoney: IResourceMethod<{ user_id: number, amount_currency: string, wallet_currency: string, amount: number }, Wallet>;

    /**
     * Convert currencies
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/withdraw-money',
        skipAuthorization: true
    })
    withdrawMoney: IResourceMethod<{ user_id: number, amount_currency: string, wallet_currency: string, amount: number }, Wallet>;

    /**
     * Convert currencies
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/show-wallet-balance',
        skipAuthorization: true
    })
    showWalletBalance: IResourceMethod<{ user_id: number, currency: string }, Wallet[]>;
}
