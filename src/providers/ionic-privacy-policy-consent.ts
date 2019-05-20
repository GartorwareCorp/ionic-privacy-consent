import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicPrivacyPolicyConsentOptions, IonicPrivacyPolicyConsentComponent, IonicPrivacyPolicyConsentResult } from '../components/ionic-privacy-policy-consent-component';

@Injectable({
  providedIn: 'root'
})
export class IonicPrivacyPolicyConsent {


  constructor(private modalCtrl: ModalController) {
  }

  async checkConsent(options: IonicPrivacyPolicyConsentOptions, checkConsentFn?: () => Promise<IonicPrivacyPolicyConsentResult>): Promise<IonicPrivacyPolicyConsentResult> {

    if (!checkConsentFn) {
      //TODO Store & check consent from storage
      checkConsentFn = () => Promise.resolve(IonicPrivacyPolicyConsentResult.UNKNOWN);
    }

    let consentResult = await checkConsentFn();
    if (consentResult === IonicPrivacyPolicyConsentResult.NO_CONSENT
      || consentResult === IonicPrivacyPolicyConsentResult.NON_PERSONAL_CONSENT_ONLY
      || consentResult === IonicPrivacyPolicyConsentResult.NON_PERSONAL_CONSENT_ONLY_UNDER_16
      || consentResult === IonicPrivacyPolicyConsentResult.PERSONAL_CONSENT) {
      return consentResult;
    }

    let privacyModal = await this.modalCtrl.create({
      component: IonicPrivacyPolicyConsentComponent,
      componentProps: {
        options: options
      },
      cssClass: options ? options.cssClass : '',
      backdropDismiss: false,
      keyboardClose: false
    });
    privacyModal.present();

    return privacyModal.onWillDismiss().then(res => {
      return res.data;
    });
  }


}
