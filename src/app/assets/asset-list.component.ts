import { Component, OnInit } from '@angular/core';

import { Asset } from './asset';
import { AssetService } from './asset.service';

@Component({
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css']
})
export class AssetListComponent implements OnInit {
  pageTitle = 'Asset List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';
  selectedCategory = '';
  _listFilter = '';
  totalPrice=0;
  totalArea=0;
  categories = ['Mall','Shops', 'Airport', 'Sports', 'Bridge','All'];
  filterValSelected = false;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredAssets = this.listFilter ? this.performFilter(this.listFilter) : this.assets;
  }

  filteredAssets: Asset[] = [];
  assets: Asset[] = [];

  constructor(private assetService: AssetService) { }

  
  performFilter(filterBy: string): Asset[] {
    return this.assets.filter((asset: Asset) =>
      asset.assetName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  assetCategoryChange(): void {  
    if(this.selectedCategory === 'All'){
      this.filterValSelected = false;
      this.filteredAssets = this.assets;
      return;
    }
    this.filterValSelected = true;
      this.filteredAssets = this.assets.filter(item => item.assetCategory === this.selectedCategory);
      console.log(typeof(this.filteredAssets));

      this.totalPrice = this.filteredAssets.reduce((acc, item) => acc + item.price, 0);
      this.totalArea = this.filteredAssets.reduce((acc, item) => acc + item.area, 0);

  }


  ngOnInit(): void {
    this.assetService.getAssets().subscribe({
      next: assets => {
        this.assets = assets;
        this.filteredAssets = this.assets;
      },
      error: err => this.errorMessage = err
    });
  }
}