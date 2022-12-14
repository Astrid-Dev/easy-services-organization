import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthStateService} from "../services/auth-state.service";
import {UserRoles} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class CanCreateEnterpriseGuard implements CanActivate {

  constructor(private authState: AuthStateService, private router: Router) {
  }

  async canActivate(route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot): Promise<boolean> {

    return new Promise((resolve, reject) => {
      this.authState.userData.subscribe(
        user =>{
          if(!user)
          {
            this.router.navigate(["/login"]);
          }
          else{
            let canCreate = (user.role === UserRoles.SIMPLE_USER);
            resolve(canCreate);
          }
        },
        err =>{
          reject(err);
        }
      )
    });
  }

}
