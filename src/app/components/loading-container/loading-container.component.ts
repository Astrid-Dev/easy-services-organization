import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-loading-container',
  templateUrl: './loading-container.component.html',
  styleUrls: ['./loading-container.component.scss']
})
export class LoadingContainerComponent {

  @Input() isLoading: boolean = false;
  @Input() hasFailedLoading: boolean = true;
  @Output('onReloadData') reload: EventEmitter<any> = new EventEmitter();

  constructor(){

  }

  ngOnInit(){

  }

  reloadData(){
    this.reload.emit();
  }

}
