import { Component, OnInit } from '@angular/core';
import { CashierService } from '../../service/cashier.service';
import { FoodService } from '../../service/food.service';
import { TicketService } from '../../service/ticket.service';
import { TicketTypeService } from '../../service/tickettype.service';
import { VoucherService } from '../../service/voucher.service';
import { TicketTypeResponse } from '../../model/ticket-type/ticket-type-response.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentWaitTimes: any;
  totalTicketTypes: number = 0;
  totalFoodItems: number = 0;
  totalEarnings: number = 0;
  totalEmployees: number = 0;
  totalVouchers: number = 0;
  totalBookings: number = 0;
  bookingNumberChartData: any;
  totalTickets: number = 0;
  totalCashiers: number = 0;

  constructor(
    private cashierService: CashierService,
    private foodService: FoodService,
    private ticketService: TicketService,
    private ticketTypeService: TicketTypeService,
    private voucherService: VoucherService,
    private router: Router
  ) {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.ticketTypeService.getTicketTypes().subscribe((types: TicketTypeResponse[]) => {
      this.totalTicketTypes = types.length;
    });

    this.foodService.getAllFoods().subscribe((foods: any[]) => {
      this.totalFoodItems = foods.length;
    });

    this.voucherService.getAllVouchers().subscribe((vouchers: any[]) => {
      this.totalVouchers = vouchers.length;
    });
    this.ticketService.getAllTickets().subscribe((tickets: any[]) => {
      this.totalTickets = tickets.length; // Changed from totalBookings
      console.log(this.totalTickets)
      this.totalBookings = this.totalTickets
    });
    this.cashierService.getAllCashiers().subscribe((cashier: any[]) => {
      this.totalCashiers = cashier.length;
      this.totalEmployees = this.totalCashiers
    });
    this.ticketService.getAllTickets().subscribe((tickets: any[]) => {
      this.totalTickets = tickets.length;
      // Calculate total earnings from tickets
      this.totalEarnings = tickets.reduce((total, ticket) => total + ticket.totalAmount, 0);
    });

   
  }
}
