import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '../../internal-providers/translate';
import { IonicPrivacyConsentOptions } from '../ionic-privacy-consent/ionic-privacy-consent-component';

const HTML_TEMPLATE = `
<ion-header>
  <ion-toolbar>
    <ion-title>{{titleText}}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">

  <p>{{descrText}}</p>
  <p>{{descr2Text}}</p>
  <p>{{descr3Text}}</p>

</ion-content>

<ion-footer>
  <ion-button fill="solid" expand="block" color="primary" (click)="dismiss()" class="go-back-button">
    <ion-label>{{backBtnText}}</ion-label>
  </ion-button>
  <ion-button fill="clear" expand="block" color="warning" (click)="onClickDecline2()" class="decline-2-button">
    <ion-label>{{declineBtnText}}</ion-label>
  </ion-button>
</ion-footer>
`;

const CSS_STYLES = `
ion-content{
  font-size: 14px;
  color: #666;
  --ion-text-color: #666;
}
`
  ;

@Component({
  selector: 'gt-privacy-consent-manage',
  template: HTML_TEMPLATE,
  styles: [CSS_STYLES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IonicPrivacyConsentManageComponent implements OnInit, OnDestroy {

  options: IonicPrivacyConsentOptions;

  titleText: string;
  descrText: string;
  descr2Text: string;
  descr3Text: string;
  backBtnText: string;
  declineBtnText: string;

  constructor(private cd: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private translate: TranslateService) {

  }

  async ngOnInit() {
    this.titleText = this.translate.instant("ARE_YOU_SURE");
    this.descrText = this.translate.instant("DECLINE_DESCR");
    this.descr2Text = this.translate.instant("DECLINE_DESCR_2");
    this.descr3Text = this.translate.instant("DECLINE_DESCR_3");
    this.backBtnText = this.translate.instant("GO_BACK");
    this.declineBtnText = this.translate.instant("DECLINE_2");
  }

  ngOnDestroy() {
  }

  dismiss(result?) {
    this.modalCtrl.dismiss(result);
  }

  onClickDecline2() {
    this.dismiss('decline');
  }

}
