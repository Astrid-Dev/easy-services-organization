import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthStateService} from "../services/auth-state.service";
import {UserRoles} from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class IsOrganizationGuard implements CanActivate, CanActivateChild {

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
            let isOrganization = ((user.role === UserRoles.ORGANIZATION) && !!(user?.organization));
            resolve(isOrganization);
          }
        },
        err =>{
          reject(err);
        }
      )
    })
  }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>{
    return this.canActivate(childRoute, state);
  }

}
