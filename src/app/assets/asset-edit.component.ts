import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Asset } from './asset';
import { AssetService } from './asset.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';

@Component({
  templateUrl: './asset-edit.component.html'
})
export class AssetEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Asset Edit';
  errorMessage: string;
  assetForm: FormGroup;

  asset: Asset;
  categories = ['Mall','Shops', 'Airport', 'Sports', 'Bridge'];
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return this.assetForm.get('tags') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private assetService: AssetService) {

    // Defines all of the validation messages for the form.
    this.validationMessages = {
      assetName: {
        required: 'Asset name is required.',
        minlength: 'Asset name must be at least three characters.',
        maxlength: 'Asset name cannot exceed 50 characters.'
      },
      assetCategory: {
        required: 'Asset category is required.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.assetForm = this.fb.group({
      assetName: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      assetCategory: ['', Validators.required],
      price:0,
      area:0,
      tags: this.fb.array([]),
      description: ''
    });

    // Read the Asset Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.getAsset(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.assetForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.assetForm);
    });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getAsset(id: number): void {
    this.assetService.getAsset(id)
      .subscribe({
        next: (asset: Asset) => this.displayAsset(asset),
        error: err => this.errorMessage = err
      });
  }

  displayAsset(asset: Asset): void {
    if (this.assetForm) {
      this.assetForm.reset();
    }
    this.asset = asset;

    if (this.asset.id === 0) {
      this.pageTitle = 'Add Asset';
    } else {
      this.pageTitle = `Edit Asset: ${this.asset.assetName}`;
    }

    // Update the data on the form
    this.assetForm.patchValue({
      assetName: this.asset.assetName,
      assetCategory: this.asset.assetCategory,
      price: this.asset.price,
      area: this.asset.area,
      description: this.asset.description
    });
    this.assetForm.setControl('tags', this.fb.array(this.asset.tags || []));
  }

  deleteAsset(): void {
    if (this.asset.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the asset: ${this.asset.assetName}?`)) {
        this.assetService.deleteAsset(this.asset.id)
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveAsset(): void {
    if (this.assetForm.valid) {
      if (this.assetForm.dirty) {
        const a = { ...this.asset, ...this.assetForm.value };

        if (a.id === 0) {
          this.assetService.createAsset(a)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.assetService.updateAsset(a)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.assetForm.reset();
    this.router.navigate(['/assets']);
  }
}