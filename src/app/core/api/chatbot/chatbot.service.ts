// Angular components
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod } from '@ngx-resource/core';

// Interfaces
import { Message } from '../../interfaces/message';

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/chatbot'
})
export class BootService extends BaseService {

    /**
     * Return the welcome message
     */
    @ResourceAction({
        method: ResourceRequestMethod.Get,
        path: '/generate-welcome-message'
    })
    generateWelcomeMessage: IResourceMethod<any, Message>;

    /**
     * Send a message
     */
    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/receive-message',
        skipAuthorization: true
    })
    sendMessage: IResourceMethod<{ message: string }, Message>;
}
