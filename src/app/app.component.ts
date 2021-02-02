import {AfterContentInit, AfterViewChecked, Component, OnInit} from '@angular/core';
import {AuthClientHelper} from './core/helpers/auth/auth-client.helper';
import {Router} from '@angular/router';
import {SpinnerHelper} from './core/helpers/spinner/spinner.helper';
import {IUser, UserService} from './core/api/user/client.service';
import {AppConstants} from './app.constants';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {CompanyService} from './core/api/company/client.service';

declare function setContentHeight();

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked, AfterContentInit {
    public loading;
    public user: IUser;
    public isLogged;
    public company_location_id;
    public observable: any;
    public APP_NAME = AppConstants.APP_NAME;
    public ACCESS_LEVEL = AppConstants.ACCESS_LEVEL;
    public APP_VERSION = AppConstants.APP_VERSION;

    constructor(private auth: AuthClientHelper,
                private router: Router,
                private userService: UserService,
                private companyService: CompanyService,
    ) {
        this.loading = false;
    }

    ngAfterViewChecked() {
        setContentHeight();
    }

    ngOnInit() {
        this.auth.isLogged.subscribe((val) => {
            this.isLogged = val;
        });

        this.auth.user.subscribe((val) => {
            this.user = val;

            if (this.user && [this.user.access_level].includes(this.ACCESS_LEVEL.sysAdmin)) {
                // 20 * 60.000 equals to 20 minutes
                if (this.observable == null) {
                    this.observable = Observable.interval(20 * 60000).subscribe(res => {

                        if (!this.auth.isLogged.value) {
                            this.observable.unsubscribe();
                            return;
                        }

                        if (this.user != null) {
                            this.userService.checkIngressCode({ingress: this.user.ingress})
                                .then(result => {
                                    if (!result) {
                                        this.logout();
                                    }
                                });
                        }
                    });
                }
            }
        });

        SpinnerHelper.loaderStatus.subscribe((val) => {
            this.loading = val;
        });

        if (this.user) {
            this.auth.setUserStatus(true);
        }
    }

    ngAfterContentInit() {
        if (this.user && [this.user.access_level].includes(this.ACCESS_LEVEL.companyAdmin)) {
            this.companyService.query({
                id: this.user.company_id,
                expand: [
                    'location'
                ]
            }).then(company => {
                this.company_location_id = company[0].location.id;
            });
        }
    }

    logout() {
        this.router.navigate(['/login']);
        this.auth.clear();
    }
}
