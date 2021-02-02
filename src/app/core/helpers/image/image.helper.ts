import {Injectable} from '@angular/core';
import {BaseService} from '../../api/base.service';

@Injectable()
export class ImageHelper {
    public web = BaseService.BASE_URL + '/uploads';

    constructor() {
    }

    getImage(obj) {
        if (obj) {
            const created = new Date(obj.created_at);
            return this.web + '/' + created.getFullYear() + '/' + (created.getMonth() + 1) + '/' + obj.id + '.' + obj.extension;
        }
        return this.web + '/no-file.png';
    }
}
