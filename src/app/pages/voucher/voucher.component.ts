import { Component, OnInit } from '@angular/core';
import { VoucherService } from './../../service/voucher.service';
import { VoucherResponse } from './../../model/voucher/VoucherResponse.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss'],
  providers: [MessageService]
})
export class VoucherComponent implements OnInit {
  vouchers: VoucherResponse[];
  editingVoucher: VoucherResponse | null = null;
  voucherCode: string;
  discount: number;
  validDays: number;
  validCustomers: number;
  validUntil: Date;

  constructor(private voucherService: VoucherService, private messageService: MessageService) {
    this.vouchers = [];
    this.voucherCode = '';
    this.discount = null;
    this.validDays = null;
    this.validCustomers = null;
    this.validUntil = null;
  }

  ngOnInit(): void {
    this.loadVouchers();
  }

  loadVouchers(): void {
    this.voucherService.getAllVouchers().subscribe(
      (response) => {
        this.vouchers = response;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Vouchers loaded successfully' });
      },
      (error) => {
        console.error('Error loading vouchers:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load vouchers' });
      }
    );
  }

  addVoucher(): void {
    const newVoucher = {
      code: this.voucherCode,
      discount: this.discount,
      validForNumberOfCustomers: this.validCustomers,
      validForNumberOfDays: this.validDays,
      validUntil: this.validUntil
    };

    this.voucherService.createVoucher(newVoucher).subscribe(
      () => {
        this.loadVouchers();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New voucher added successfully' });
      },
      (error) => {
        console.error('Error adding voucher:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add voucher' });
      }
    );

    this.resetForm();
  }

  editVoucher(voucher: VoucherResponse): void {
    this.editingVoucher = voucher;
  }

  saveVoucher(): void {
    if (this.editingVoucher) {
      this.voucherService.updateVoucher(this.editingVoucher.id, this.editingVoucher).subscribe(
        () => {
          this.editingVoucher = null;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Voucher updated successfully' });
        },
        (error) => {
          console.error('Error updating voucher:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update voucher' });
        }
      );
    }
  }

  cancelEdit(): void {
    this.editingVoucher = null;
  }

  deleteVoucher(id: number): void {
    this.voucherService.deleteVoucher(id).subscribe(
      () => {
        this.loadVouchers();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Voucher deleted successfully' });
      },
      (error) => {
        console.error('Error deleting voucher:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete voucher' });
      }
    );
  }

  decreaseValidCustomers(voucher: VoucherResponse): void {
    voucher.validForNumberOfCustomers--;
    this.voucherService.updateVoucher(voucher.id, voucher).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Valid for number of customers decreased successfully' });
      },
      (error) => {
        console.error('Error updating voucher:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update voucher' });
      }
    );
  }

  resetForm(): void {
    this.voucherCode = '';
    this.discount = 0;
    this.validDays = 0;
    this.validCustomers = 0;
    this.validUntil = null;
  }
}
