import { HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

export class LoggingInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log('Outgoing request')
        console.log(req.url)
        console.log(req.headers)
        return next.handle(req).pipe(
            tap(event => {
                if (event.type === HttpEventType.Response) {
                    console.log('Incoming Request')
                    console.log(event.body)
                }
            })
        )
    }
}