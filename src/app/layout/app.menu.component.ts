import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                items: [
                    { label: 'Sales', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/'] },
                    { label: 'Tickets', icon: 'pi pi-fw pi-user', routerLink: ['/tickets'] },
                    { label: 'Vouchers', icon: 'pi pi-fw pi-money-bill', routerLink: ['/voucher'] },
                    { label: 'Users', icon: 'pi pi-fw pi-user-plus', routerLink: ['/users'] },
                    { label: 'Foods', icon: 'pi pi-fw pi-tags', routerLink: ['/food'] },
                    { label: 'Ticket Controller', icon: 'pi pi-fw pi-box', routerLink: ['/ticket-controller'] },
                    { label: 'Admin Dashboard', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin-dashboard'] },
                ]
            },
        ];
    }
}
