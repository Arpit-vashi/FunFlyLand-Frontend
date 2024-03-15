import { NgModule } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleComponent } from './pages/sale/sale.component';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TableModule} from 'primeng/table';
import { TicketComponent } from './pages/ticket/ticket.component';
import { VoucherComponent } from './pages/voucher/voucher.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { FoodComponent } from './pages/food/food.component';
import { TicketTypeComponent } from './pages/ticket-type/ticket-type.component';
import {DialogModule} from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import {ToastModule} from 'primeng/toast';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ChartModule } from 'primeng/chart';
import { UsersComponent } from './pages/users/users.component';

@NgModule({
    declarations: [
        UsersComponent,
        AppComponent, 
        NotfoundComponent,
        SaleComponent,
        TicketComponent,
        VoucherComponent,
        FoodComponent, 
        TicketTypeComponent,
        AdminDashboardComponent
    ],
    imports: [
        ChartModule,
        AppRoutingModule,
        AppLayoutModule,
        InputNumberModule,
        DropdownModule,
        InputTextModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        CalendarModule,
        InputTextareaModule,
        DialogModule,
        CommonModule,
        ToastModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
