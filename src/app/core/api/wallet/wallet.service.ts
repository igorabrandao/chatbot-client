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

    // ***************************************************
    // ** Resource action handlers
    // ***************************************************

    /**
     * Register a new wallet
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/register-wallet',
        skipAuthorization: true
    })
    actionRegisterWallet: IResourceMethod<{ user_id: number, currency: string }, Wallet>;

    /**
     * Set a wallet as default
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/set-default-wallet',
        skipAuthorization: true
    })
    actionSetDefaultWallet: IResourceMethod<{ code: string }, Wallet>;

    /**
     * Check if the user already have a default wallet
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/set-default-wallet',
        skipAuthorization: true
    })
    actionCheckDefaultWallet: IResourceMethod<{ user_id: number }, Wallet>;

    // ***************************************************
    // ** Service functions handlers
    // ***************************************************

    /**
     * Function to register a new wallet
     * 
     * @param user_id_ 
     * @param currency_ 
     */
    registerWallet(user_id_: number, currency_: string) {
        try {
            this.actionRegisterWallet({user_id: user_id_, currency: currency_})
                .then(data => {
                    if (data) {
                        return data;
                    } else {
                        return false;
                    }
                });
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Function to set the wallet as default
     * 
     * @param code_
     */
    setDefaultWallet(code_: string) {
        try {
            this.actionSetDefaultWallet({code: code_})
                .then(data => {
                    if (data) {
                        return data;
                    } else {
                        return false;
                    }
                });
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * Function to check if the user already have a default wallet
     * 
     * @param user_id_
     */
    checkDefaultWallet(user_id_: number) {
        try {
            this.actionCheckDefaultWallet({user_id: user_id_})
                .then(data => {
                    if (data) {
                        return data;
                    } else {
                        return false;
                    }
                });
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
