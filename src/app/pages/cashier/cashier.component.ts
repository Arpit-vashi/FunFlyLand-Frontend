import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CashierService } from './../../service/cashier.service';
import { CashierResponse } from './../../model/cashier/cashier-response.model';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.scss']
})
export class CashierComponent implements OnInit {
  displayBasic: boolean;
  cashierForm: FormGroup;
  cashiers: CashierResponse[];
  editingCashier: CashierResponse | null = null; // Track currently editing cashier

  constructor(private formBuilder: FormBuilder, private cashierService: CashierService) {
    this.cashierForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      salary: [null, Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      joiningDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCashiers();
  }

  loadCashiers(): void {
    this.cashierService.getAllCashiers().subscribe(
      (response) => {
        this.cashiers = response;
      },
      (error) => {
        console.error('Error loading cashiers:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.cashierForm.valid) {
      if (this.editingCashier) {
        // If editing, update the existing cashier
        this.updateCashier();
      } else {
        // If not editing, create a new cashier
        this.createCashier();
      }
    } else {
      console.error('Form is invalid.');
    }
  }

  createCashier(): void {
    this.cashierService.createCashier(this.cashierForm.value).subscribe(
      () => {
        console.log('Cashier added successfully!');
        this.loadCashiers();
        this.cashierForm.reset();
      },
      (error) => {
        console.error('Error adding cashier:', error);
      }
    );
  }

  updateCashier(): void {
    if (this.editingCashier) {
      this.cashierService.updateCashier(this.editingCashier.id, this.cashierForm.value).subscribe(
        () => {
          console.log('Cashier updated successfully!');
          this.loadCashiers(); // Fetch updated data
          this.cashierForm.reset(); // Reset the form fields
          this.editingCashier = null; // Reset editing state after saving changes
        },
        (error) => {
          console.error('Error updating cashier:', error);
        }
      );
    }
  }

  deleteCashier(id: number): void {
    this.cashierService.deleteCashier(id).subscribe(
      () => {
        console.log('Cashier deleted successfully!');
        this.loadCashiers();
      },
      (error) => {
        console.error('Error deleting cashier:', error);
      }
    );
  }

  onRowEditInit(cashier: CashierResponse): void {
    this.editingCashier = cashier; // Set the cashier to be edited
    // Populate the form fields with cashier data for editing
    this.cashierForm.patchValue({
      username: cashier.username,
      salary: cashier.salary,
      email: cashier.email,
      mobileNumber: cashier.mobileNumber,
      joiningDate: new Date(cashier.joiningDate) // Convert to Date object
    });
  }

  onRowEditSave(cashier: CashierResponse): void {
    // Save the changes made to the cashier
    this.updateCashier();
  }

  onRowEditCancel(): void {
    this.editingCashier = null; // Cancel editing
    this.cashierForm.reset(); // Reset the form fields
  }
}
