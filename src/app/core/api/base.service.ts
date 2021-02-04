import { ErrorHandler, Injectable } from '@angular/core';
import { AuthClientHelper } from '../helpers/auth/auth-client.helper';
import { environment } from '../../../environments/environment';
import { IResourceActionInner, IResourceResponse, Resource } from '@ngx-resource/core';
import { ResourceHandler } from '@ngx-resource/core/src/ResourceHandler';
import { ToastrService } from 'ngx-toastr';
import { SpinnerHelper } from '../helpers/spinner/spinner.helper';

/**
 Generated class for the BaseService.
 */

@Injectable()
export class BaseService extends Resource implements ErrorHandler {
    public static BASE_URL = environment.apiUrl;

    constructor(requestHandler: ResourceHandler,
        private auth: AuthClientHelper,
        private toastr: ToastrService) {
        super(requestHandler);
    }

    $getHeaders(methodOptions: any): any {
        let headers = super.$getHeaders();

        // Extending our headers with Authorization
        headers = this.auth.extendHeaders(headers);
        
        /*if (!methodOptions.skipAuthorization) {
            headers = this.auth.extendHeaders(headers);
        }*/

        return headers;
    }

    protected $handleErrorResponse(options: IResourceActionInner, resp: IResourceResponse): any {
        SpinnerHelper.displayLoader(false);
        console.log('Error at handleErrorResponse', resp);
        const body = resp.body;
        const body_0 = resp.body[0];

        if (!options.actionOptions.skipError) {
            let errorMsg = 'An error has occurred';

            if (body && body.error && body.error.length && body.error[0].field) {
                errorMsg = body.error.map(function (e) {
                    return e.message;
                }).join('\n');
            } else if (body && body.error && body.error[0]) {
                errorMsg = body.error.join('\n');
            } else if (body && body.error && body.error.message) {
                errorMsg = body.error.message;
            } else if (body && body[0] && body[0].message) {
                errorMsg = body.message;
            } else if (body && body.message) {
                errorMsg = body.message;
            }

            if (body_0 && body_0.message) {
                errorMsg = body_0.message;
            }

            //this.toastr.error(errorMsg, 'Error');
            return resp;
        }

        return super.$handleErrorResponse(options, resp);
    }

    protected $handleSuccessResponse(options: IResourceActionInner, resp: IResourceResponse): any {
        SpinnerHelper.displayLoader(false);
        return super.$handleSuccessResponse(options, resp);
    }

    $restAction(options: IResourceActionInner): any {
        // console.log(options);
        if (!options.actionOptions.skipLoading) {
            SpinnerHelper.displayLoader(true);
        }
        return super.$restAction(options);
    }

    handleError(err: any): void {
        console.error(err);
    }
}
