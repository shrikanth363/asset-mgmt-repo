import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { AssetEditComponent } from './asset-edit.component';

@Injectable({
  providedIn: 'root'
})
export class AssetEditGuard implements CanDeactivate<AssetEditComponent> {
  canDeactivate(component: AssetEditComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.assetForm.dirty) {
      const assetName = component.assetForm.get('assetName').value || 'New Asset';
      return confirm(`Navigate away and lose all changes to ${assetName}?`);
    }
    return true;
  }
}