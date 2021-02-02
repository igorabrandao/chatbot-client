import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/api/user/client.service';
import { AuthClientHelper } from '../../core/helpers/auth/auth-client.helper';
import {AppConstants} from '../../app.constants';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    public APP_VERSION = AppConstants.APP_VERSION;
    public APP_NAME = AppConstants.APP_NAME;
    public APP_YEAR = AppConstants.APP_YEAR;
    public access_levels = AppConstants.ACCESS_LEVEL;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private userService: UserService,
                private auth: AuthClientHelper,
                private toastr: ToastrService) {
        this.loginForm = formBuilder.group({
            'email': [null, [Validators.email, Validators.required]],
            'password': [null, Validators.required],
        });
    }

    onLogin() {
        this.userService.login(this.loginForm.value)
            .then(user => {
                if (user.status === 202) {
                    this.toastr.success('', 'Entre com suas credenciais e código enviado por e-mail!');
                    this.router.navigate(['/login-code', {email : this.loginForm.value['email']}]);
                    return true;
                }
                if (![this.access_levels.sysAdmin, this.access_levels.companyAdmin].includes(user.access_level)) {
                    this.toastr.error('', 'Nível de acesso não permitido!');
                    return;
                }
                this.auth.setUser({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    cpf: user.cpf,
                    access_token: user.access_token,
                    access_level: user.access_level,
                    company_id: user.company_id,
                });
                this.router.navigate(['/home']);
            });
    }
}
