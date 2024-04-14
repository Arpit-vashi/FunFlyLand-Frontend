import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from './../../service/food.service';
import { FoodResponse } from './../../model/food/food-response.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
  providers: [MessageService]
})
export class FoodComponent implements OnInit {
  foods: FoodResponse[];
  editingIndex: number | null = null;
  foodForm: FormGroup;

  constructor(private fb: FormBuilder, private foodService: FoodService, private messageService: MessageService) {
    this.foods = [];
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foodService.getAllFoods().subscribe(
      (response) => {
        this.foods = response;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Foods loaded successfully' });
      },
      (error) => {
        console.error('Error loading foods:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load foods' });
      }
    );
  }

  addFood(): void {
    if (this.foodForm) {
      const newFood: FoodResponse = this.foodForm.value;
      this.foodService.addFood(newFood).subscribe(
        () => {
          this.loadFoods();
          this.foodForm.reset();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food added successfully' });
        },
        (error) => {
          console.error('Error adding food:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add food' });
        }
      );
    } else {
      console.error('Invalid form data.');
    }
  }

  editFood(food: FoodResponse): void {
    if (this.editingIndex === null) {
      this.editingIndex = this.foods.indexOf(food);
    } else {
      console.error('Another row is already being edited.');
    }
  }

  saveFood(food: FoodResponse): void {
    if (this.editingIndex !== null) {
      this.foodService.updateFood(food.id, food).subscribe(
        () => {
          this.editingIndex = null;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food updated successfully' });
        },
        (error) => {
          console.error('Error updating food:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update food' });
        }
      );
    }
  }

  cancelEdit(): void {
    this.editingIndex = null;
  }

  deleteFood(id: number): void {
    this.foodService.deleteFood(id).subscribe(
      () => {
        this.loadFoods();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Food deleted successfully' });
      },
      (error) => {
        console.error('Error deleting food:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete food' });
      }
    );
  }
}
