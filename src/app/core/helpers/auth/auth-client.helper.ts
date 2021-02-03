import { LocalStorageService } from 'ngx-webstorage';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { SpinnerHelper } from '../spinner/spinner.helper';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import * as sjcl from 'sjcl';
import 'rxjs/add/operator/catch';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthClientHelper {
    isLogged: BehaviorSubject<any> = new BehaviorSubject<any>(false);
    user: BehaviorSubject<any> = new BehaviorSubject<any>(this.getUser());

    constructor(private storage: LocalStorageService,
                private toastr: ToastrService) {
    }

    extendHeaders(headers) {
        const user = this.getUser();
        if (user) {
            headers.Authorization = 'Bearer ' + user.access_token;
        }
        return headers;
    }

    isGuest() {
        return null === this.getUser();
    }

    setUserStatus(val) {
        this.isLogged.next(val);
    }

    setUser(user) {
        if (user.data !== undefined && user.data !== null) {
            this.user.next(user.data);
        } else if (user.result !== undefined && user.result !== null) {
            this.user.next(user.result);
        } else {
            this.user.next(user);
        }

        this.isLogged.next(true);
        this.storage.store('user', sjcl.encrypt('123', JSON.stringify(user), {}, {}).replace(/,/g, ',\n'));
    }

    logout() {
        this.user.next([]);
        this.isLogged.next(false);
        this.storage.clear();
    }

    getUser() {
        if (this.storage.retrieve('user') !== null) {
            return JSON.parse(sjcl.decrypt('123', this.storage.retrieve('user')));
        }
        return null;
    }

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     return next.handle(request).do((event: HttpEvent<any>) => {
    //         if (event instanceof HttpResponse) {
    //             SpinnerHelper.displayLoader(false);
    //         } else {
    //             SpinnerHelper.displayLoader(true);
    //         }
    //     }).catch((event) => {
    //         SpinnerHelper.displayLoader(false);
    //         console.log(event);
    //         let errorMsg = 'Ocorreu um erro';
    //         if (event.error[0] && event.error[0].field) {
    //             errorMsg = event.error.map(function (e) {
    //                 return e.message;
    //             }).join('\n');
    //         } else if (event.error[0]) {
    //             errorMsg = event.error.join('\n');
    //         } else {
    //             errorMsg = event.error.message;
    //         }
    //
    //         this.toastr.error(errorMsg || 'Ocorreu um erro', 'Erro');
    //         return [];
    //     });
    // }
}
