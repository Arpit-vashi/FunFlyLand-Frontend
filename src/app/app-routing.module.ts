import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { RouterModule } from '@angular/router';
import { SaleComponent } from './pages/sale/sale.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { VoucherComponent } from './pages/voucher/voucher.component';
import { FoodComponent } from './pages/food/food.component';
import { TicketTypeComponent } from './pages/ticket-type/ticket-type.component';
import { ManageAdminComponent } from './pages/manage-admin/manage-admin.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UsersComponent } from './pages/users/users.component';


@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        { path: '', component:  SaleComponent},
                        { path: 'tickets', component:  TicketComponent},
                        { path: 'voucher', component:  VoucherComponent},
                        { path: 'users', component:  UsersComponent},
                        { path: 'food', component:  FoodComponent},
                        { path: 'ticket-controller', component:  TicketTypeComponent},
                        { path: 'admin-dashboard', component:  AdminDashboardComponent}
                       
                ],   
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
