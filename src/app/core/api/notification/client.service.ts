import {Injectable} from '@angular/core';
import {BaseService} from '../base.service';
import {IResourceMethod, ResourceAction, ResourceParams, ResourceRequestMethod} from '@ngx-resource/core';

/**
 Class for the NotificationService.
 */

@Injectable()
@ResourceParams({
    url: BaseService.BASE_URL + '/v1/push-notification'
})
export class NotificationService extends BaseService {

    @ResourceAction({
        method: ResourceRequestMethod.Post,
        path: '/send-push-notification'
    })
    sendPushNotification: IResourceMethod<any, any>;
}
