import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, ToastController, AlertController } from '@ionic/angular';
import { TranslateService } from '../internal-providers/translate';
import { DomSanitizer } from '@angular/platform-browser';

export type IonicPrivacyPolicyConsentLangs = "en" | "es";

export interface IonicPrivacyPolicyConsentOptions {
  language?: IonicPrivacyPolicyConsentLangs,
  privacyPolicy?: string,
  paidVersion?: boolean, //TODO
  explicitAgeConfirmation?: boolean,
  shortQuestion?: boolean,
  cssClass?: string | string[]
}

export enum IonicPrivacyPolicyConsentResult {
  /**
     * users consent is unknown, it needs to be requests
     */
  UNKNOWN,
  /**
   * user consent given: he does not accept any usage of personal data nor non personal data
   */
  NO_CONSENT,
  /**
   * user consent given: he accept non personal data only
   */
  NON_PERSONAL_CONSENT_ONLY,
  /**
 * user consent given: he accept non personal data only and didn't explicit confirm he is over 16
 */
  NON_PERSONAL_CONSENT_ONLY_UNDER_16,
  /**
   * user consent given: he accepts personal data usage
   */
  PERSONAL_CONSENT
}

const HTML_TEMPLATE = `
<ion-header>
  <ion-toolbar>
    <ion-title>{{titleText}}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content padding>

  <p class="care-text">{{careText}}</p>

  <p class="message-text" [innerHtml]="alertMessageText"></p>

  <p class="short-question-text" *ngIf="options.shortQuestion">{{shortQuestionText}}</p>

  <p class="age-text" *ngIf="!options.explicitAgeConfirmation">{{ageText}}</p>
  <ion-item class="age-check" *ngIf="options.explicitAgeConfirmation">
    <ion-label class="ion-text-wrap">{{explicitAgeText}}</ion-label>
    <ion-checkbox slot="end" [(ngModel)]="explicitAgeConfirmation">
    </ion-checkbox>
  </ion-item>

</ion-content>

<ion-footer padding>
  <ion-button fill="solid" expand="block" color="primary" (click)="onClickAgree()" class="agree-button">
    <ion-label>{{acceptText}}</ion-label>
  </ion-button>
  <ion-button fill="clear" expand="block" color="warning" (click)="onClickDecline()" class="decline-button">
    <ion-label>{{declineText}}<br>
    </ion-label>
  </ion-button>
  <ion-button fill="clear" expand="block" color="danger" (click)="onClickReject()" class="reject-button">
    <ion-label>{{exitText}}</ion-label>
  </ion-button>
</ion-footer>
`;

const CSS_STYLE = `
ion-content{
  font-size: 14px;
  color: #666;
  --ion-text-color: #666;
  .care-text {
      font-size: 95%;
      font-weight: 700;
      text-align: center;
  }
  .short-question-text{
      font-size: 110%;
      font-weight: 700;
      text-align: center;
  }
  .age-check {
      font-size: 14px;
  }
}
.decline-button{
  margin-top: 4px;
}
`;

@Component({
  selector: 'app-privacy-policy-consent',
  template: HTML_TEMPLATE,
  styles: [CSS_STYLE],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonicPrivacyPolicyConsentComponent implements OnInit, OnDestroy {

  options: IonicPrivacyPolicyConsentOptions;
  explicitAgeConfirmation: boolean = false;

  titleText;
  careText;
  shortQuestionText;
  ageText;
  explicitAgeText;
  acceptText;
  declineText;
  exitText;
  urlLabelText;
  alertMessageText;

  private defaultOpt: IonicPrivacyPolicyConsentOptions = {
    language: 'en',
    explicitAgeConfirmation: false,
    shortQuestion: true,
  }
  private ngBackButtonSubscription;

  constructor(private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private sanitized: DomSanitizer) { }

  async ngOnInit() {
    this.options = Object.assign({}, this.defaultOpt, this.options);

    console.log(this.options);

    await this.translate.use(this.options.language);

    this.titleText = this.translate.instant("TITLE");
    this.careText = this.translate.instant("CARE_TEXT");
    this.shortQuestionText = this.translate.instant("SHORT_QUESTION");
    this.ageText = this.translate.instant("AGE_CONFIRMATION");
    this.explicitAgeText = this.translate.instant("EXPLICIT_AGE_CONFIRMATION");
    this.acceptText = this.translate.instant("ACCEPT");
    this.declineText = this.translate.instant("DECLINE");
    this.exitText = this.translate.instant("EXIT");
    this.urlLabelText = this.translate.instant("PRIVACY_URL_LABEL");

    let messageText = this.translate.instant("MESSAGE");
    if (this.options.privacyPolicy && !this.options.privacyPolicy.startsWith("https://") && !this.options.privacyPolicy.startsWith("http://")) {
      this.options.privacyPolicy = "http://" + this.options.privacyPolicy;
    }
    let privacyLink = this.options.privacyPolicy ? '<a target="_blank" href="' + this.options.privacyPolicy + '">' + this.urlLabelText + '</a>' : this.urlLabelText;

    this.alertMessageText = this.sanitized.bypassSecurityTrustHtml(messageText.replace('##PRIVACY_PLACEHOLDER##', privacyLink));

    this.ngBackButtonSubscription = this.platform.backButton.subscribeWithPriority(1, () => {
      let chooseActionMsg = this.translate.instant('CHOOSE_ACTION');
      this.toastCtrl.create({ message: chooseActionMsg, duration: 2500 }).then(toast => toast.present());
    });

    this.cd.markForCheck();
  }

  ngOnDestroy() {
  }

  dismiss(result) {
    this.modalCtrl.dismiss(result);
    // deregister handler after modal closes
    if (this.ngBackButtonSubscription) this.ngBackButtonSubscription.unsubscribe();
    this.ngBackButtonSubscription = null;
  }

  onClickReject() {
    this.dismiss(IonicPrivacyPolicyConsentResult.NO_CONSENT);
  }

  onClickAgree() {
    if (this.options.explicitAgeConfirmation && !this.explicitAgeConfirmation) {
      const explicitAgeConfirmationWarningText = this.translate.instant('EXPLICIT_AGE_CONFIRMATION_WARNING');
      this.toastCtrl.create({ message: explicitAgeConfirmationWarningText, duration: 2500 }).then(toast => toast.present());
      return;
    }
    this.dismiss(IonicPrivacyPolicyConsentResult.PERSONAL_CONSENT);
  }

  async onClickDecline() {
    const areYouSureText = this.translate.instant("ARE_YOU_SURE");
    const decline2Text = this.translate.instant("DECLINE_2");
    const goBackText = this.translate.instant("GO_BACK");
    const declineDescrText = this.translate.instant("DECLINE_DESCR");

    let alert = await this.alertCtrl.create({
      cssClass: "consent-alert",
      backdropDismiss: false,
      keyboardClose: false,
      header: areYouSureText,
      message: declineDescrText,
      buttons: [
        {
          text: decline2Text,
          cssClass: 'decline-2-button',
          handler: () => {
            this.onClickDecline2();
          }
        },
        {
          text: goBackText,
          cssClass: 'go-back-button',
          handler: () => { }
        }
      ]
    });
    alert.present();
  }

  onClickDecline2() {
    let result = this.options.explicitAgeConfirmation && !this.explicitAgeConfirmation ?
      IonicPrivacyPolicyConsentResult.NON_PERSONAL_CONSENT_ONLY_UNDER_16
      : IonicPrivacyPolicyConsentResult.NON_PERSONAL_CONSENT_ONLY;
    this.dismiss(result);
  }

}
