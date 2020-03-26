import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicPrivacyConsentOptions, IonicPrivacyConsentComponent, IonicPrivacyConsentResult } from '../components/ionic-privacy-consent/ionic-privacy-consent-component';

@Injectable({
  providedIn: 'root'
})
export class IonicPrivacyConsent {


  constructor(private modalCtrl: ModalController) {
  }

  async checkConsent(options: IonicPrivacyConsentOptions, checkConsentFn?: () => Promise<IonicPrivacyConsentResult>): Promise<IonicPrivacyConsentResult> {

    let opt = Object.assign({}, options);

    if (!checkConsentFn) {
      //TODO Store & check consent from storage
      checkConsentFn = () => Promise.resolve(IonicPrivacyConsentResult.UNKNOWN);
    }

    let consentResult = await checkConsentFn();
    if (!opt.forceShow &&
      (consentResult === IonicPrivacyConsentResult.NON_PERSONAL_CONSENT_ONLY
        || consentResult === IonicPrivacyConsentResult.NON_PERSONAL_CONSENT_ONLY_UNDER_16
        || consentResult === IonicPrivacyConsentResult.PERSONAL_CONSENT)) {
      return consentResult;
    }

    let privacyModal = await this.modalCtrl.create({
      component: IonicPrivacyConsentComponent,
      componentProps: {
        options: opt
      },
      cssClass: opt.cssClass || '',
      enterAnimation: opt.enterAnimation,
      leaveAnimation: opt.leaveAnimation,
      backdropDismiss: false,
      keyboardClose: false
    });
    privacyModal.present();

    return privacyModal.onWillDismiss().then(res => {
      return res.data;
    });
  }


}
