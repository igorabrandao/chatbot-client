import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

/**
 Class for the UserService.
 */

export interface IUser {
    id?: number;
    name?: string;
    email?: string;
    cpf?: string;
    is_active?: number;
    created_at?: string;
    updated_at?: string;
    access_token?: string;
    access_level?: number;
    password?: string;
    status?: number;
    ingress?: string;
    company_id?: number;
}

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/users'
})
export class UserService extends BaseService {
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/login-by-code',
        skipAuthorization: true
    })
    loginByCode: IResourceMethod<{ email: string, password: string, ingress: string }, IUser>;

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/check-ingress-code',
        skipAuthorization: true,
        skipLoading: true
    })
    checkIngressCode: IResourceMethod<{ ingress: string }, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/login',
        skipAuthorization: true
    })
    login: IResourceMethod<{ email: string, password: string }, IUser>;

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
        path: '/recover-password'
    })
    recoverPassword: IResourceMethod<{ email: string}, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/reset-password'
    })
    resetPassword: IResourceMethod<any, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/check-reset-password-token'
    })
    checkResetPasswordToken: IResourceMethod<any, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Get,
        path: '/get-webfarma-delivery-staff'
    })
    getWebfarmaDeliveryStaff: IResourceMethod<any, any>;

    @ResourceAction({
        method: ResourceRequestMethod.Get,
        path: '/get-webfarma-delivery'
    })
    getWebfarmaDelivery: IResourceMethod<any, any>;
}
