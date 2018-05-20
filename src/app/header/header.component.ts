import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    public user: firebase.User = null;

    constructor(public authService: AuthService, public router: Router) {

    }

    signInWithGoogle() {
        this.authService.signInWithGoogle()
            .then((res) => {
                this.authService.getUser().subscribe(
                    (user) => {
                        if (user && user.uid === '68C1aJlVLDWwOKJorirlm9AVomT2') {
                            this.user = user;
                        }
                        else {
                            this.user = null;
                        }
                    }
                );
            })
            .catch((err) => console.log(err));
    }

    ngOnInit() {
        this.authService.getUser().subscribe(
            (user) => {
                if (user && user.uid === '68C1aJlVLDWwOKJorirlm9AVomT2') {
                    this.user = user;
                }
                else {
                    this.user = null;
                    alert('You have to sign in by SM Admin Support account !');
                }
                console.log(user);
            }
        );
    }

    signout() {
        this.authService.logout();
        this.user = null;
        console.log('Signed Out !!!');
    }

}
