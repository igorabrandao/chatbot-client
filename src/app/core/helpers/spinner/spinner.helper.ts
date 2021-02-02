import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerHelper {
    static loaderStatus: BehaviorSubject<any> = new BehaviorSubject<any>(false);

    static displayLoader(value: boolean) {
        const prop = (value) ? 'block' : 'none';
        SpinnerHelper.loaderStatus.next(prop);
    }
}
