import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from './../../service/user.service';
import { UserRequest } from '../../model/users/user-request.model';
import { UserResponse } from '../../model/users/user-response.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService]
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  users: UserResponse[];
  editingUser: UserResponse | null = null;
  roles = [
    { label: 'Cashier', value: 'Cashier' },
    { label: 'Admin', value: 'Admin' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {
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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Users loaded successfully' });
      },
      (error) => {
        console.error('Error loading users:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.editingUser) {
        this.updateUser();
      } else {
        this.createUser();
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Form is invalid' });
    }
  }

  createUser(): void {
    const userRequest: UserRequest = {
      ...this.userForm.value,
      role: this.userForm.value.role.value
    };
    this.userService.createUser(userRequest).subscribe(
      () => {
        this.loadUsers();
        this.userForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User added successfully' });
      },
      (error) => {
        console.error('Error adding user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add user' });
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
          this.loadUsers();
          this.userForm.reset();
          this.editingUser = null;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
        },
        (error) => {
          console.error('Error updating user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
        }
      );
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
      },
      (error) => {
        console.error('Error deleting user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
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
