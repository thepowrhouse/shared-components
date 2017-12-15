import {Component, Input} from "@angular/core";
import {IHeaderItem} from "./header-item";
import {Router} from "@angular/router";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private _router:Router) {

  }

  public isCollapsed = true;

  @Input()
  title:string;

  @Input()
  items:Array<IHeaderItem>;

  filter(items:Array<IHeaderItem>, type:string) {
    return items.filter(i=> i.type == type)
  }

  clicked(link:string) {
    this._router.navigate([link]);
  }
}
