import {Component, OnInit} from '@angular/core';
import {People} from '../models/People';
import {ActivatedRoute, Router} from '@angular/router';
import {SpinnerService} from '@chevtek/angular-spinners/dist';
import {PeoplesService} from '../service/peoples.service';
import * as firebase from 'firebase';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-peoples',
    templateUrl: './peoples.component.html',
    styleUrls: ['./peoples.component.scss']
})
export class PeoplesComponent implements OnInit {
    public user: firebase.User = null;
    peoples: People[] = [];
    finalPeoples: People[] = [];
    peoplesSubscription: any;
    supportUid = '68C1aJlVLDWwOKJorirlm9AVomT2';

    constructor(public router: Router,
                public route: ActivatedRoute,
                public authService: AuthService,
                public spinnerService: SpinnerService,
                public peoplesService: PeoplesService) {
    }

    ngOnInit() {
        this.peoplesService.isLoading$.subscribe(isLoading => {
            if (isLoading) {
                this.spinnerService.show('AppRoom');
            } else {
                this.spinnerService.hide('AppRoom');
            }
        });

        this.authService.getUser().subscribe(
            (user) => {
                if (user) {
                    this.user = user;
                    this.listPeoples();
                }
                else {
                    this.user = null;
                }
            }
        );
    }

    listPeoples() {
        this.peoplesSubscription = this.peoplesService.list().subscribe(peoples => {
            console.log('listPeople', peoples);
            this.peoples = [];
            this.peoples = peoples;
            // sort descending timestamp
            this.peoples.sort(function (a, b) {
                return b.timestamp - a.timestamp
            });

            // display every people chat to list
            this.peoples.forEach(people => {
                this.displayPeople(people);
            });
        });
    }

    displayPeople(people: People) {
        const strKey = people.$key;

        const res = strKey.split('_');
        let selUid = res[0];
        if (res[0] === this.supportUid) {
            selUid = res[1];
        }

        firebase.database().ref('/firebase_users/' + selUid).once('value', (function (snapshot) {
            const fullname = (snapshot.val() && snapshot.val().fullname);
            const uid = (snapshot.val() && snapshot.val().uid);
            const urlPhoto = (snapshot.val() && snapshot.val().urlPhoto);

            const p = new People();
            p.key = strKey;
            p.fullname = fullname;
            p.urlPhoto = urlPhoto;
            p.lastMessage = people.lastMessage;
            p.timestamp = people.timestamp;

            this.addPeople(p);
        }).bind(this));

    };

    addPeople(people: People) {
        this.finalPeoples.push(people);
    }

    onPeopleItemClicked(people: People) {
        console.log('clicked: ' + people.key);
        this.router.navigate(['/messages'],
            {queryParams: {groupKey: people.key}});
    }
}
