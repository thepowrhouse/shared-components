import {Component, OnInit} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName:string;
  password:string;

  ngOnInit() {

  }

  constructor(public activeModal:NgbActiveModal) {

  }

  login() {
    this.activeModal.close({
      action: 'Login',
      userName: this.userName,
      password: this.password
    });
  }
}
