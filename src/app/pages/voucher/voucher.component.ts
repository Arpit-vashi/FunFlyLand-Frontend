import { Component, OnInit } from '@angular/core';
import { VoucherService } from './../../service/voucher.service';
import { VoucherResponse } from './../../model/voucher/VoucherResponse.model';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {
  vouchers: VoucherResponse[];
  editingVoucher: VoucherResponse | null = null; // Track currently editing voucher
  voucherCode: string;
  discount: number;
  validDays: number;
  validCustomers: number;
  validUntil: Date;

  constructor(private voucherService: VoucherService) {
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
        console.log('Vouchers:', this.vouchers); // Log all vouchers received
      },
      (error) => {
        console.error('Error loading vouchers:', error);
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
        console.log('New Voucher Added:', newVoucher);
        // Reload vouchers after addition
        this.loadVouchers();
      },
      (error) => {
        console.error('Error adding voucher:', error);
      }
    );

    // Optionally, you can reset the form fields here
    this.resetForm();
  }

  editVoucher(voucher: VoucherResponse): void {
    this.editingVoucher = voucher; // Set the editing voucher
  }

  saveVoucher(): void {
    if (this.editingVoucher) {
      this.voucherService.updateVoucher(this.editingVoucher.id, this.editingVoucher).subscribe(
        () => {
          console.log('Voucher updated successfully:', this.editingVoucher);
          this.editingVoucher = null; // Reset editing state
        },
        (error) => {
          console.error('Error updating voucher:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.editingVoucher = null; // Cancel editing
  }

  deleteVoucher(id: number): void {
    this.voucherService.deleteVoucher(id).subscribe(
      () => {
        console.log('Voucher deleted successfully.');
        // Reload the table after deletion
        this.loadVouchers();
      },
      (error) => {
        console.error('Error deleting voucher:', error);
      }
    );
  }

  decreaseValidCustomers(voucher: VoucherResponse): void {
    // Decrease the "Valid for Number of Customers" property of the voucher
    voucher.validForNumberOfCustomers--;
    // Update the voucher on the server
    this.voucherService.updateVoucher(voucher.id, voucher).subscribe(
      () => {
        console.log('Valid for Number of Customers Decreased for Voucher:', voucher);
      },
      (error) => {
        console.error('Error updating voucher:', error);
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
