import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthStateService} from "../services/auth-state.service";

@Injectable({
  providedIn: 'root'
})
export class IsSignedOutGuard implements CanActivate {

  constructor(private authState: AuthStateService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Promise<boolean> {

    return new Promise((resolve, reject) => {
      this.authState.userAuthState.subscribe(
        res =>{
          if(res)
          {
            this.router.navigate(["home"])
          }
          resolve(!res);
        },
        err =>{
          reject(err);
        }
      )
    })
  }

}
