// Angular components
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

// Interfaces
import { User } from '../../interfaces/user';

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/users'
})
export class UserService extends BaseService {
  
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

    /**
     * Perform login
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/login',
        skipAuthorization: true
    })
    login: IResourceMethod<{ email: string, password: string }, User>;

    /**
     * Register user
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/register-user',
        skipAuthorization: true
    })
    register: IResourceMethod<{ name: string, email: string, cpf: string, password: string, birth_date: string }, User>;

    /**
     * Recover password
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/recover-password'
    })
    recoverPassword: IResourceMethod<{ email: string }, any>;

    /**
     * Reset password
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/reset-password'
    })
    resetPassword: IResourceMethod<any, any>;

    /**
     * Check recovery token
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/check-reset-password-token'
    })
    checkResetPasswordToken: IResourceMethod<any, any>;
}
