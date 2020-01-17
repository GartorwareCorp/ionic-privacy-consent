import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicPrivacyConsent } from './providers/ionic-privacy-consent';
import { TranslateService } from './internal-providers/translate';
import { IonicPrivacyConsentComponent } from './components/ionic-privacy-consent/ionic-privacy-consent-component';
import { IonicPrivacyConsentManageComponent } from './components/ionic-privacy-consent-manage/ionic-privacy-consent-manage-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    // declare all components that your module uses
    IonicPrivacyConsentComponent,
    IonicPrivacyConsentManageComponent
  ],
  entryComponents: [
    // If not lazy loaded
    IonicPrivacyConsentComponent,
    IonicPrivacyConsentManageComponent
  ],
  exports: [
    // export the component(s) that you want others to be able to use
    IonicPrivacyConsentComponent,
    IonicPrivacyConsentManageComponent
  ]
})
export class IonicPrivacyConsentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicPrivacyConsentModule,
      providers: [IonicPrivacyConsent, TranslateService]
    };
  }
}

