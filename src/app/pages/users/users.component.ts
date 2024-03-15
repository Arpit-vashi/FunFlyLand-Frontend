import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../service/user.service';
import { UserRequest } from '../../model/users/user-request.model';
import { UserResponse } from '../../model/users/user-response.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  users: UserResponse[];
  editingUser: UserResponse | null = null; // Track currently editing user
  roles = [
    { label: 'Cashier', value: 'Cashier' },
    { label: 'Admin', value: 'Admin' }
  ];

  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      salary: [null, Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      role: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response: UserResponse[]) => {
        this.users = response;
        console.log('Users loaded successfully:', this.users);
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  onSubmit(): void {
    console.log('Form data:', this.userForm.value);
    if (this.userForm.valid) {
      if (this.editingUser) {
        this.updateUser();
      } else {
        this.createUser();
      }
    } else {
      console.error('Form is invalid.');
    }
  }

  createUser(): void {
    const userRequest: UserRequest = {
      ...this.userForm.value,
      role: this.userForm.value.role.value
    };
    this.userService.createUser(userRequest).subscribe(
      () => {
        console.log('User added successfully!');
        this.loadUsers();
        this.userForm.reset();
      },
      (error) => {
        console.error('Error adding user:', error);
      }
    );
  }
  

  updateUser(): void {
    if (this.editingUser) {
      const userRequest: UserRequest = {
        ...this.userForm.value,
        role: this.userForm.value.role.value
      };
      this.userService.updateUser(this.editingUser.id, userRequest).subscribe(
        () => {
          console.log('User updated successfully!');
          this.loadUsers();
          this.userForm.reset();
          this.editingUser = null;
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted successfully!');
        this.loadUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  onRowEditInit(user: UserResponse): void {
    this.editingUser = user;
    this.userForm.patchValue({
      username: user.username,
      salary: user.salary,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role
    });
  }

  onRowEditSave(user: UserResponse): void {
    this.updateUser();
  }

  onRowEditCancel(): void {
    this.editingUser = null;
    this.userForm.reset();
  }
}
