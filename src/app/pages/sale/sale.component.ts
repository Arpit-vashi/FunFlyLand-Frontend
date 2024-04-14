import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TicketTypeService } from '../../service/tickettype.service';
import { FoodService } from '../../service/food.service';
import { VoucherService } from '../../service/voucher.service';
import { TicketTypeResponse } from 'src/app/model/ticket-type/ticket-type-response.model';
import { TicketService } from "./../../service/ticket.service";
import { TicketResponse } from "../../model/ticket/ticket-response.model";
import { TicketRequest } from "../../model/ticket/ticket-request.model";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as QRCode from 'qrcode';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss'],
  providers: [MessageService]
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
  voucherId: any;
  printDisabled: boolean = true;

  paymentMethods = [
    { label: 'Cash', value: 'cash' },
    { label: 'Card', value: 'card' },
    { label: 'UPI', value: 'upi' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
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
    });
  }

  loadFoodOptions() {
    this.foodService.getAllFoods().subscribe(foods => {
      this.foodOptions = [{ name: 'NONE', price: 0 }, ...foods];
    });
  }

  loadVouchers() {
    this.voucherService.getAllVouchers().subscribe(vouchers => {
      this.vouchers = vouchers;
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
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

      this.checkVoucherValidity();

      this.TicketService.createTicket(ticketRequest).subscribe(
        (response: TicketResponse) => {
          if (ticketRequest.promotionCode) {
            this.voucherService.getVoucherById(this.voucherId).subscribe(
              (voucher) => {
                if (voucher) {
                  voucher.validForNumberOfCustomers--;
                  this.voucherService.updateVoucher(voucher.id, voucher).subscribe(
                    () => {
                      console.log(`Valid persons decreased for voucher ${voucher.code}`);
                    },
                    (error) => {
                      console.error('Error updating voucher:', error);
                    }
                  );
                }
              },
              (error) => {
                console.error('Error fetching voucher:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error creating ticket:', error);
        }
      );

      this.printDisabled = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Form is invalid. Please fill all fields.' });
    }
    this.ticketForm.reset();
  }

  async generatePdfWithQRCode() {
    if (this.ticketForm.valid) {
      const formValues = this.ticketForm.value;
      const doc = new jsPDF();

      const logo = new Image();
      logo.src = 'https://img.icons8.com/papercut/60/theme-park.png';
      const center = (doc.internal.pageSize.getWidth() / 2) - (30 / 2);
      doc.addImage(logo, 'PNG', center, 10, 30, 30);
      doc.setFontSize(16);
      doc.setFont('bold');
      doc.text("FunFlyLand", center, 50, { align: 'center', });

      let yPos = 80;
      const tableData = [];
      for (const [key, value] of Object.entries(formValues)) {
        if (key === 'foodOption') {
          const foodOptionValue = (value as any)?.name;
          tableData.push(['Food Option', foodOptionValue]);
        } else if (key === 'paymentMethod') {
          const paymentMethodValue = (value as any)?.value;
          tableData.push(['Payment Method', paymentMethodValue]);
        } else {
          tableData.push([key, value]);
        }
      }

      autoTable(doc, {
        startY: yPos,
        head: [['Field', 'Value']],
        body: tableData,
        styles: {
          fontSize: 10,
          fontStyle: 'bold',
        },
      });

      const totalCostY = yPos + 170;
      doc.setFont('bold');
      doc.text("Total cost:", 10, totalCostY);
      doc.setFont('normal');
      doc.text(`${this.totalCost}`, 80, totalCostY);

      const qrText = JSON.stringify(formValues);
      const qrCodeSize = 30;
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const qrCodeX = pageWidth - qrCodeSize - margin;
      const qrCodeY = pageHeight - qrCodeSize - margin;

      const qrCodeDataUrl = await QRCode.toDataURL(qrText);
      doc.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Thanks visit again", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.height - 10, { align: 'center' });

      const fileName = `${formValues.firstName}_Ticket.pdf`;
      doc.save(fileName);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Cannot generate PDF. Please fill all fields in the form.' });
    }
  }

  calculateTotalPersons() {
    const numberOfAdults = this.ticketForm.value.numberOfAdults || 0;
    const numberOfChildren = this.ticketForm.value.numberOfChildren || 0;
    this.totalPersons = numberOfAdults + numberOfChildren;
    this.getSelectedFoodPrice();
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    const ticketTypePrice = this.ticketTypes[0].ticketTypePrice;
    const foodPrice = this.getSelectedFoodPrice();
    const ticketTypeCost = this.totalPersons * ticketTypePrice;
    const foodCost = this.totalPersons * foodPrice;
    const previousAddition = ticketTypeCost + foodCost;
    const additionalCost = previousAddition * 0.15;
    this.totalCost = previousAddition + additionalCost;

    const promotionCode = this.ticketForm.value.promotionCode;
    const voucher = this.vouchers.find(voucher => voucher.code === promotionCode);
    if (voucher) {
      const discountPercentage = voucher.discount;
      const discountAmount = (discountPercentage / 100) * this.totalCost;
      this.totalCost -= discountAmount;
    }

    const taxAmount = additionalCost;
    this.ticketForm.patchValue({ taxAmount });

    const totalAmount = this.totalCost;
    this.ticketForm.patchValue({ totalAmount });
  }

  getSelectedFoodPrice(): number {
    let selectedFood = this.foodOptions.find(food => food.name === this.ticketForm.value.foodOption.name);
    let selectedFoodPrice;
    if (selectedFood) {
      selectedFoodPrice = this.ticketForm.value.foodOption.price
    }
    return selectedFoodPrice;
    this.calculateTotalCost();
  }

  removeVoucher() {
    this.ticketForm.patchValue({ promotionCode: '' });
    this.calculateTotalCost();
  }

  checkVoucherValidity() {
    let found = false;
    for (const voucher of this.vouchers) {
      if (voucher.code === this.ticketForm.value.promotionCode) {
        this.voucherId = voucher.id;
        this.voucherValidityMessage = `Voucher is valid. Discount: ${voucher.discount}`;
        found = true;
        break;
      }
    }
    if (!found) {
      this.voucherValidityMessage = 'Invalid voucher';
    }

    this.calculateTotalCost();
  }
}
