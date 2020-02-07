import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Platform, ModalController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '../../internal-providers/translate';
import { IonicPrivacyConsentManageComponent } from '../ionic-privacy-consent-manage/ionic-privacy-consent-manage-component';

export type IonicPrivacyConsentLangs = "en" | "es";

export interface IonicPrivacyConsentOptions {
  language?: IonicPrivacyConsentLangs,
  privacyPolicy?: string,
  tos?: string,
  paidVersion?: boolean, //TODO
  explicitAgeConfirmation?: boolean,
  shortQuestion?: boolean,
  cssClass?: string | string[],
  forceShow?: boolean
}

export enum IonicPrivacyConsentResult {
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

<ion-content class="ion-padding">

  <p class="care-text">{{careText}}</p>

  <p class="message-text" [innerHtml]="alertMessageText"></p>

  <p class="short-question-text" *ngIf="options.shortQuestion">{{shortQuestionText}}</p>

  <p class="tos-text" [innerHtml]="tosText" *ngIf="options.tos"></p>

  <p class="age-text" *ngIf="!options.explicitAgeConfirmation">{{ageText}}</p>
  <ion-item class="age-check" *ngIf="options.explicitAgeConfirmation">
    <ion-label class="ion-text-wrap">{{explicitAgeText}}</ion-label>
    <ion-checkbox slot="end" [(ngModel)]="explicitAgeConfirmation">
    </ion-checkbox>
  </ion-item>

</ion-content>

<ion-footer class="ion-padding">
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

const CSS_STYLES = `
ion-content{
  font-size: 14px;
  color: #666;
  --ion-text-color: #666;
}
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
.decline-button{
  margin-top: 8px;
}
.consent-alert .alert-message.sc-ion-alert-md,
.consent-alert .alert-message.sc-ion-alert-ios {
  font-size: 14px;
}
`
  ;

@Component({
  selector: 'gt-privacy-consent',
  template: HTML_TEMPLATE,
  styles: [CSS_STYLES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonicPrivacyConsentComponent implements OnInit, OnDestroy {

  options: IonicPrivacyConsentOptions;
  explicitAgeConfirmation: boolean = false;

  titleText: string;
  careText: string;
  shortQuestionText: string;
  ageText: string;
  explicitAgeText: string;
  acceptText: string;
  declineText: string;
  exitText: string;
  urlLabelText: string;
  alertMessageText: any;
  tosText: any;
  tosUrlLabelText: string;

  private defaultOpt: IonicPrivacyConsentOptions = {
    language: 'en',
    explicitAgeConfirmation: false,
    shortQuestion: true,
  }
  private ngBackButtonSubscription;

  constructor(private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private platform: Platform,
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
    this.tosText = this.translate.instant("TOS_CONFIRMATION");
    this.tosUrlLabelText = this.translate.instant("TOS_URL_LABEL");

    // Privacy Policy text and link
    const messageText = this.translate.instant("MESSAGE");
    if (this.options.privacyPolicy && !this.options.privacyPolicy.startsWith("https://") && !this.options.privacyPolicy.startsWith("http://")) {
      this.options.privacyPolicy = "http://" + this.options.privacyPolicy;
    }
    const privacyLink = this.options.privacyPolicy ? '<a target="_blank" href="' + this.options.privacyPolicy + '">' + this.urlLabelText + '</a>' : this.urlLabelText;
    this.alertMessageText = this.sanitized.bypassSecurityTrustHtml(messageText.replace('##PRIVACY_PLACEHOLDER##', privacyLink));

    // TOS text and link
    if (this.options.tos && !this.options.tos.startsWith("https://") && !this.options.tos.startsWith("http://")) {
      this.options.tos = "http://" + this.options.tos;
    }
    const tosLink = this.options.tos ? '<a target="_blank" href="' + this.options.tos + '">' + this.tosUrlLabelText + '</a>' : this.tosUrlLabelText;
    this.tosText = this.sanitized.bypassSecurityTrustHtml(this.tosText.replace('##TOS_PLACEHOLDER##', tosLink));

    // Back button 
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
    this.dismiss(IonicPrivacyConsentResult.NO_CONSENT);
  }

  onClickAgree() {
    if (this.options.explicitAgeConfirmation && !this.explicitAgeConfirmation) {
      const explicitAgeConfirmationWarningText = this.translate.instant('EXPLICIT_AGE_CONFIRMATION_WARNING');
      this.toastCtrl.create({ message: explicitAgeConfirmationWarningText, duration: 2500 }).then(toast => toast.present());
      return;
    }

    this.dismiss(IonicPrivacyConsentResult.PERSONAL_CONSENT);
  }

  async onClickDecline() {
    if (this.options.explicitAgeConfirmation && !this.explicitAgeConfirmation) {
      const explicitAgeConfirmationWarningText = this.translate.instant('EXPLICIT_AGE_CONFIRMATION_WARNING');
      this.toastCtrl.create({ message: explicitAgeConfirmationWarningText, duration: 2500 }).then(toast => toast.present());
      return;
    }

    let modal = await this.modalCtrl.create({
      component: IonicPrivacyConsentManageComponent,
      componentProps: {
        options: this.options
      },
      cssClass: this.options.cssClass || '',
      backdropDismiss: false,
      keyboardClose: false,
    });
    modal.present();

    let declineData = await modal.onDidDismiss();
    if (declineData.data && declineData.data === 'decline') {
      let result = this.options.explicitAgeConfirmation && !this.explicitAgeConfirmation ?
        IonicPrivacyConsentResult.NON_PERSONAL_CONSENT_ONLY_UNDER_16
        : IonicPrivacyConsentResult.NON_PERSONAL_CONSENT_ONLY;
      this.dismiss(result);
    }
  }

}
