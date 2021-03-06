import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Datatarget } from '../datatarget.model';
import { BackButton } from '@shared/models/back-button.model';
import { environment } from '@environments/environment';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'a[app-datatarget-list]',
    templateUrl: './datatarget-list.component.html',
    styleUrls: ['./datatarget-list.component.scss']
})
export class DatatargetListComponent implements OnInit {

    public pageLimit = environment.tablePageSize;
    public title: string;
    public backButton: BackButton = { label: '', routerLink: ''};
    public datatarget: Datatarget;
    private applikationId: string;

    constructor(
        public translate: TranslateService,
        private titleService: Title,
        private route: ActivatedRoute) {
        translate.use('da');
    }

    ngOnInit(): void {
        const applikationName: string = this.route.snapshot.paramMap.get('name');
        this.applikationId = this.route.snapshot.paramMap.get('id');
        this.translate.get(["NAV.DATATARGET", "NAV.APPLICATIONS", "TITLE.DATATARGET"])
            .subscribe((translate) => {
                this.title = translate['NAV.DATATARGET'] + ' - ' + applikationName;
                this.backButton.label = translate['NAV.APPLICATIONS'];
                this.titleService.setTitle(translate['TITLE.DATATARGET']);
            });
        this.setBackButton()
    }

    setBackButton() {
        this.backButton.routerLink = ['applications', this.applikationId];
    }

    updatePageLimit(limit: any) {
        console.log(limit);
    }
}
