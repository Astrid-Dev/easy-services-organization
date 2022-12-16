import { Component, OnInit } from '@angular/core';
import {OrganizationService} from "../../services/organization.service";
import {User} from "../../models/User";
import {Organization} from "../../models/Organization";
import {AuthStateService} from "../../services/auth-state.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  hasLoadedUserData: boolean | null = null;
  hasLoadedStats: boolean | null = null;
  user!: User;
  statistics: any = {};

  constructor(
    private authStateService: AuthStateService,
    private organizationService: OrganizationService
  ) { }

  get isLoading(){
    return (this.hasLoadedStats === null || this.hasLoadedUserData === null)
  }

  get hasFailedLoading(){
    return ((this.hasLoadedUserData === false && this.hasLoadedStats !== null) ||
      (this.hasLoadedStats === false && this.hasLoadedUserData !== null)
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    if(!this.hasLoadedUserData){
      this.loadUser();
    }
    if(!this.hasLoadedStats){
      this.loadOrganizationDashboard();
    }
  }

  loadUser(){
    this.hasLoadedUserData = null;
    this.authStateService.userData.subscribe({
      next: (user) =>{
        if(user){
          this.user = user;
          this.hasLoadedUserData = true;
        }
        else{
          this.hasLoadedUserData = false;
        }
      },
      error: (err) =>{
        console.error(err);
        this.hasLoadedUserData = false;
      }
    });
  }

  loadOrganizationDashboard(){
    this.hasLoadedStats = null;
    this.organizationService.getAnOrganizationDashboard(this.user?.organization?.id as number)
      .then((res: any) =>{
        console.log(res);
        this.statistics = res;
        this.hasLoadedStats = true;
      })
      .catch((err) =>{
        console.error(err);
        this.hasLoadedStats = false;
      });
  }

}
