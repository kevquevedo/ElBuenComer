import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent  implements OnInit {
  usuario: any;

  constructor(private afAuth :AngularFireAuth, private router:Router ) { }

  ngOnInit() {
    this.afAuth.currentUser.then(user => {
      this.usuario = user?.email
      console.log(this.usuario);
    })
  }

  logOut(){
    this.afAuth.signOut().then(() => this.router.navigate([""]));
  }
}
