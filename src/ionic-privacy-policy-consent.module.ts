import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonicPrivacyPolicyConsent } from 'src/providers/ionic-privacy-policy-consent';

@NgModule({
  declarations: [
    // declare all components that your module uses
  ],
  exports: [
    // export the component(s) that you want others to be able to use
  ]
})
export class IonicPrivacyPolicyConsentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicPrivacyPolicyConsentModule,
      providers: [IonicPrivacyPolicyConsent]
    };
  }
}

