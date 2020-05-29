import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AssetData } from './asset-data';

import { AssetListComponent } from './asset-list.component';
//import { AssetDetailComponent } from './asset-detail.component';
import { AssetEditComponent } from './asset-edit.component';
import { AssetEditGuard } from './asset-edit.guard';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(AssetData),
    RouterModule.forChild([
      { path: 'assets', component: AssetListComponent },
   /*   { path: 'assets/:id', component: AssetDetailComponent },*/
      {
        path: 'assets/:id/edit',
        canDeactivate: [AssetEditGuard],
        component: AssetEditComponent
      }
    ])
  ],
  declarations: [
    AssetListComponent,
   // AssetDetailComponent,
     AssetEditComponent
  ]
})
export class AssetModule { }