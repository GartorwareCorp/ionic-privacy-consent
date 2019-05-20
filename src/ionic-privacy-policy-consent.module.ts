import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicPrivacyPolicyConsent } from './providers/ionic-privacy-policy-consent';
import { TranslateService } from './internal-providers/translate';
import { IonicPrivacyPolicyConsentComponent } from './components/ionic-privacy-policy-consent-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    // declare all components that your module uses
    IonicPrivacyPolicyConsentComponent
  ],
  entryComponents: [
    // If not lazy loaded
    IonicPrivacyPolicyConsentComponent
  ],
  exports: [
    // export the component(s) that you want others to be able to use
    IonicPrivacyPolicyConsentComponent
  ]
})
export class IonicPrivacyPolicyConsentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicPrivacyPolicyConsentModule,
      providers: [IonicPrivacyPolicyConsent, TranslateService]
    };
  }
}

