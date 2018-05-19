import {Component, OnInit} from '@angular/core';
import {People} from '../models/People';
import {ActivatedRoute} from '@angular/router';
import {SpinnerService} from '@chevtek/angular-spinners/dist';
import {PeoplesService} from '../service/peoples.service';
import * as firebase from 'firebase';

@Component({
    selector: 'app-peoples',
    templateUrl: './peoples.component.html',
    styleUrls: ['./peoples.component.scss']
})
export class PeoplesComponent implements OnInit {

    peoples: People[] = [];
    finalPeoples: People[] = [];
    peoplesSubscription: any;
    supportUid = '68C1aJlVLDWwOKJorirlm9AVomT2';

    constructor(public route: ActivatedRoute,
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
    }

    listRooms() {
        this.peoplesSubscription = this.peoplesService.list().subscribe(peoples => {
            console.log('listPeople', peoples);
            this.peoples = peoples;
            this.peoples.forEach(people => {
                this.displayPeople(people);
            });
        });
    }

    displayPeople(people: People) {
        const strKey = people.$key;
        console.log('key ' + strKey);

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
            p.key = people.key;
            p.fullname = fullname;
            p.urlPhoto = urlPhoto;
            p.lastMessage = people.lastMessage;
            p.timestamp = people.timestamp;

            this.addPeople(p);
            console.log('People: ' + p);
        }).bind(this));

    };

    addPeople(people: People) {
        this.finalPeoples.push(people);
    }

}
