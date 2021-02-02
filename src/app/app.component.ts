import { AfterContentInit, AfterViewChecked, Component, OnInit } from '@angular/core';
import { AuthClientHelper } from './core/helpers/auth/auth-client.helper';
import { Router } from '@angular/router';
import 'rxjs/add/observable/interval';

declare function setContentHeight();

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked, AfterContentInit {
    public loading;
    public isLogged;
    public observable: any;

    constructor(private auth: AuthClientHelper,
        private router: Router
    ) {
        this.loading = false;
    }

    ngAfterViewChecked() {}

    ngOnInit() { }

    ngAfterContentInit() {}
}
