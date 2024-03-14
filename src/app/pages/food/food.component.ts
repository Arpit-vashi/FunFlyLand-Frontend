import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodService } from './../../service/food.service';
import { FoodResponse } from './../../model/food/food-response.model';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {
  foods: FoodResponse[];
  editingIndex: number | null = null;
  foodForm: FormGroup;

  constructor(private fb: FormBuilder, private foodService: FoodService) {
    this.foods = [];
    this.foodForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      imageUrl: [''] // No Validators.required
    });
    
  }

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foodService.getAllFoods().subscribe(
      (response) => {
        this.foods = response;
        console.log('Foods:', this.foods); // Log all foods received
      },
      (error) => {
        console.error('Error loading foods:', error);
      }
    );
  }

  addFood(): void {
    debugger
    if (this.foodForm) {
      const newFood: FoodResponse = this.foodForm.value;
      this.foodService.addFood(newFood).subscribe(
        (response) => {
          console.log('Food added successfully:', response);
          this.loadFoods(); // Refresh the table after addition
          this.foodForm.reset(); // Reset the form
        },
        (error) => {
          console.error('Error adding food:', error);
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
          console.log('Food updated successfully:', food);
          this.editingIndex = null; // Reset editing state
        },
        (error) => {
          console.error('Error updating food:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.editingIndex = null; // Cancel editing
  }

  deleteFood(id: number): void {
    this.foodService.deleteFood(id).subscribe(
      () => {
        console.log('Food deleted successfully.');
        // Reload the table after deletion
        this.loadFoods();
      },
      (error) => {
        console.error('Error deleting food:', error);
      }
    );
  }
}
