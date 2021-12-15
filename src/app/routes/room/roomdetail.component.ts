import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';

import { EChartsOption } from 'echarts';
import { Observable, Observer } from 'rxjs';

@Component({
    selector: 'app-room-detail',
    templateUrl: './roomdetail.component.html',
})
export class RoomDetailComponent implements OnInit {
    isVisible = false;
    isOkLoading = false;

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isOkLoading = true;
        setTimeout(() => {
            this.isVisible = false;
            this.isOkLoading = false;
        }, 3000);
    }

    handleCancel(): void {
        this.isVisible = false;
    }
    validateForm: FormGroup;

    submitForm(value: any): void {
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
        console.log(value);
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
            this.validateForm.controls[key].updateValueAndValidity();
        }
    }

    validateConfirmPassword(): void {
        setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
    }

    userNameAsyncValidator = (control: FormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
            setTimeout(() => {
                if (control.value === 'JasonWood') {
                    // you have to return `{error: true}` to mark it as an error event
                    observer.next({ error: true, duplicated: true });
                } else {
                    observer.next(null);
                }
                observer.complete();
            }, 1000);
        });

    confirmValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (control.value !== this.validateForm.controls.password.value) {
            return { confirm: true, error: true };
        }
        return {};
    };

    constructor(private fb: FormBuilder) {
        this.validateForm = this.fb.group({
            userName: ['', [Validators.required], [this.userNameAsyncValidator]],
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required]],
            confirm: ['', [this.confirmValidator]],
            comment: ['', [Validators.required]]
        });
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}