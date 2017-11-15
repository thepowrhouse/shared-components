import {Component, Input} from "@angular/core";
import {IHeaderItem} from "./header-item";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  public isCollapsed = true;

  @Input()
  title:string;

  @Input()
  items:Array<IHeaderItem>;

  filter(items:Array<IHeaderItem>, type:string) {
    return items.filter(i=> i.type == type)
  }

}
