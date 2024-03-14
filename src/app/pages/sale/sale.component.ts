import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketTypeService } from '../../service/tickettype.service';
import { FoodService } from '../../service/food.service';
import { VoucherService } from '../../service/voucher.service';
import { TicketTypeResponse } from 'src/app/model/ticket-type/ticket-type-response.model';
import { TicketService } from "./../../service/ticket.service";
import { TicketResponse } from "../../model/ticket/ticket-response.model";
import { TicketRequest } from "../../model/ticket/ticket-request.model";

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  ticketForm: FormGroup;
  ticketTypes: TicketTypeResponse[] = [];
  ticketTypes2: any[] = [];
  foodOptions: any[] = [];
  vouchers: any[] = [];
  totalPersons: number = 0;
  totalCost: number = 0;
  voucherCode: string = '';
  voucherValidityMessage: string = '';

  paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Card', value: 'card' },
    { label: 'UPI', value: 'upi' }
  ];

  constructor(
    private fb: FormBuilder,
    private ticketTypeService: TicketTypeService,
    private TicketService: TicketService,
    private foodService: FoodService,
    private voucherService: VoucherService
  ) { }

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      visitDate: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      ticketType: ['', Validators.required],
      numberOfAdults: ['', Validators.required],
      numberOfChildren: ['', Validators.required],
      foodOption: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      taxAmount: ['', Validators.required],
      totalAmount: ['', Validators.required],
      promotionCode: [''],
      address: ['', Validators.required]
    });

    this.loadTicketTypes();
    this.loadFoodOptions();
    this.loadVouchers();
  }

  loadTicketTypes() {
    this.ticketTypeService.getTicketTypes().subscribe(types => {
      this.ticketTypes = types;
      this.ticketTypes2 = this.ticketTypes.map(type => type.ticketTypeName);
      console.log('Ticket Types:', this.ticketTypes);
    });
  }

  loadFoodOptions() {
    this.foodService.getAllFoods().subscribe(foods => {
      // Add NONE option with foodPrice as 0
      this.foodOptions = [{ name: 'NONE', price: 0 }, ...foods];
      console.log('Food Options:', this.foodOptions);
    });
  }

  loadVouchers() {
    this.voucherService.getAllVouchers().subscribe(vouchers => {
      this.vouchers = vouchers;
      console.log('Vouchers:', this.vouchers);
    });
  }

  onSubmit() {
  if (this.ticketForm.valid) {
    console.log('Form data:', this.ticketForm.value);
    const ticketRequest: TicketRequest = {
      date: this.ticketForm.value.visitDate,
      firstName: this.ticketForm.value.firstName,
      lastName: this.ticketForm.value.lastName,
      email: this.ticketForm.value.email,
      mobileNumber: this.ticketForm.value.mobileNumber,
      ticketType: this.ticketForm.value.ticketType,
      numberOfAdults: this.ticketForm.value.numberOfAdults,
      numberOfChildren: this.ticketForm.value.numberOfChildren,
      foodOption: this.ticketForm.value.foodOption.name,
      paymentMethod: this.ticketForm.value.paymentMethod.value,
      taxAmount: this.ticketForm.value.taxAmount,
      totalAmount: this.ticketForm.value.totalAmount,
      promotionCode: this.ticketForm.value.promotionCode,
      address: this.ticketForm.value.address
    };

    this.TicketService.createTicket(ticketRequest).subscribe(
      (response: TicketResponse) => {
        console.log('Ticket created successfully:', response);
        // Handle success - maybe show a success message or navigate to another page
        
        // After ticket is saved, apply voucher logic
        // if (ticketRequest.promotionCode) {
        //   this.voucherService.getVoucherById(ticketRequest.promotionCode).subscribe(
        //     (voucher) => {
        //       if (voucher) {
        //         voucher.validForNumberOfCustomers--; // Decrease validForNumberOfCustomers by 1
        //         this.voucherService.updateVoucher(voucher.id, voucher).subscribe(
        //           () => {
        //             console.log(`Valid persons decreased for voucher ${voucher.code}`);
        //           },
        //           (error) => {
        //             console.error('Error updating voucher:', error);
        //           }
        //         );
        //       }
        //     },
        //     (error) => {
        //       console.error('Error fetching voucher:', error);
        //     }
        //   );
        // }
      },
      (error) => {
        console.error('Error creating ticket:', error);
        // Handle error - maybe show an error message to the user
      }
    );
  } else {
    console.error('Form is invalid. Cannot submit.');
    // Handle invalid form submission
  }
}

  

  calculateTotalAmount() {
    // Calculate total amount logic
  }

  applyDiscountFromVoucher() {
    const promotionCode = this.ticketForm.value.promotionCode;
    const voucher = this.vouchers.find(voucher => voucher.code === promotionCode);
  
    if (voucher) {
      const discountPercentage = voucher.discount;
      const discountAmount = (discountPercentage / 100) * this.totalCost;
      this.totalCost -= discountAmount;
  
      console.log(`Discount of ${discountAmount} applied. Total Cost after discount: ${this.totalCost}`);
    } else {
      console.log('Invalid or expired promotion code.');
    }
  }
  

  checkVoucherValidity() {
    let found = false;
    for (const voucher of this.vouchers) {
      if (voucher.code === this.ticketForm.value.promotionCode) {
        this.voucherValidityMessage = `Voucher is valid. Discount: ${voucher.discount}`;
        console.log(this.voucherValidityMessage);
        found = true;
        break;
      }
    }
    if (!found) {
      this.voucherValidityMessage = 'Invalid voucher';
      console.log(this.voucherValidityMessage);
    }
  
    // Recalculate total cost after checking voucher validity
    this.calculateTotalCost();
  }
  

  calculateTotalPersons() {
    const numberOfAdults = this.ticketForm.value.numberOfAdults || 0;
    const numberOfChildren = this.ticketForm.value.numberOfChildren || 0;
    this.totalPersons = numberOfAdults + numberOfChildren;
    console.log('Total Persons:', this.totalPersons);
    this.getSelectedFoodPrice()
    this.calculateTotalCost();
  }

  calculateTotalCost() {
  debugger
    const ticketTypePrice = this.ticketTypes[0].ticketTypePrice;
    const foodPrice = this.getSelectedFoodPrice();
    const ticketTypeCost = this.totalPersons * ticketTypePrice;
    const foodCost = this.totalPersons * foodPrice;
    const previousAddition = ticketTypeCost + foodCost;
    const additionalCost = previousAddition * 0.15; // 15% of the previous addition
    this.totalCost = previousAddition + additionalCost;
  
    // Check if a valid voucher is entered
    const promotionCode = this.ticketForm.value.promotionCode;
    const voucher = this.vouchers.find(voucher => voucher.code === promotionCode);
    if (voucher) {
      const discountPercentage = voucher.discount;
      const discountAmount = (discountPercentage / 100) * this.totalCost;
      this.totalCost -= discountAmount;
      console.log(`Discount of ${discountAmount} applied from voucher. Total Cost after discount: ${this.totalCost}`);
    }

    const taxAmount = additionalCost;
    this.ticketForm.patchValue({ taxAmount }); // Automatically fill the taxAmount field in the form
  
    console.log('Total Cost:', this.totalCost);
    // Calculate Total amount
    const totalAmount = this.totalCost;
    this.ticketForm.patchValue({ totalAmount }); // Automatically fill the taxAmount field in the form
  
    console.log('Total Cost:', this.totalCost);
  }

  getSelectedFoodPrice(): number {
    let selectedFood = this.foodOptions.find(food => food.name === this.ticketForm.value.foodOption.name);
    let  selectedFoodPrice;
    if(selectedFood) {
      selectedFoodPrice = this.ticketForm.value.foodOption.price
    }
    return selectedFoodPrice
    this.calculateTotalCost()

  }
  


  removeVoucher() {
    // Reset voucher code and clear voucher effect on price
    this.ticketForm.patchValue({ promotionCode: '' });
    this.calculateTotalCost();
  }
  
}
