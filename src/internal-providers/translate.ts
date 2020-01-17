import { Injectable } from '@angular/core';

const i18n = {
  en: {
    "TITLE": "ToS & Privacy",
    "CARE_TEXT": "We care about your privacy and data security",
    "PAID_OR_FREE": "We maintain this app by using third party services",
    "MESSAGE": "This app collects some data for its operation, including device identifiers among other data. Such data are used to offer the service, to personalise content and ads, to provide social media features and for anonymous analytics. Futhermore, some of this information (no personal data) could be shared with our advertising and analytics partners. Please, review our ##PRIVACY_PLACEHOLDER## for full details on how your data will be protected and managed.",
    "SHORT_QUESTION": "Can we continue to use your data for this purposes?",
    "AGE_CONFIRMATION": "By continuing you are confirming that you are over the age of 16.",
    "EXPLICIT_AGE_CONFIRMATION": "I'm over the age of 16",
    "EXPLICIT_AGE_CONFIRMATION_WARNING": "Please, confirm that you are over the age of 16",
    "PRIVACY_URL_LABEL": "Privacy Policy",
    "ACCEPT": "Accept & continue",
    "DECLINE": "Decline",
    "DECLINE_2": "Decline",
    "DECLINE_DESCR": "I understand that I still see the same number of ads, but they may not be as relevant to my interests.",
    "DECLINE_DESCR_2": "On top of that, I understand that some data, including device identifiers among others, could still be collected to offer and monitor the service, to personalise content (no ads), to provide social media features and for anonymous analytics.",
    "DECLINE_DESCR_3": "I still agree to the Terms of Service plus I confirm that I'm over the age of 16.",
    "EXIT": "I don't agree. Exit now.",
    "CHOOSE_ACTION": "Please, choose an action",
    "ARE_YOU_SURE": "Are you sure?",
    "GO_BACK": "Go back",
    "TOS_CONFIRMATION": "By continuing you agree to our ##TOS_PLACEHOLDER##.",
    "TOS_URL_LABEL": "Terms of Service"
  },
  es: {
    "TITLE": "TS & privacidad",
    "CARE_TEXT": "Tu privacidad y la seguridad de tus datos son importantes para nosotros",
    "PAID_OR_FREE": "Esta app se mantiene gracias a servicios de terceros",
    "MESSAGE": "Esta aplicación recopila algunos datos para su funcionamiento, incluyendo identificadores de dispositivo entre otros. Estos datos se usan para ofrecer y monitorizar el servicio, personalizar el contenido y los anuncios, con el fin de ofrecer funciones de medios sociales y para recopilar datos estadísticos y de uso de forma anónima. Así mismo alguna de esta información (no datos personales) pueden ser compartidos con nuestros partners de publicidad y de análisis. Por favor, revisa nuestra ##PRIVACY_PLACEHOLDER## para obtener todos los detalles sobre como sus datos son tratados y protegidos",
    "SHORT_QUESTION": "¿Podemos continuar usando sus datos para estos propósitos?",
    "AGE_CONFIRMATION": "Al continuar usted confirma que es mayor de 16 años.",
    "EXPLICIT_AGE_CONFIRMATION": "Tengo más de 16 años",
    "EXPLICIT_AGE_CONFIRMATION_WARNING": "Por favor, confirme que tiene más de 16 años",
    "PRIVACY_URL_LABEL": "Política de Privacidad",
    "ACCEPT": "Aceptar y continuar",
    "DECLINE": "Declinar",
    "DECLINE_2": "Declinar",
    "DECLINE_DESCR": "Entiendo que aún veré la misma cantidad de anuncios, pero que pueden no ser tan relevantes para mis intereses.",
    "DECLINE_DESCR_2": "Además, entiendo que algunos datos, incluyendo identificadores de dispositivo entre otros, aún podrán ser recopilados para para ofrecer y monitorizar el servicio, personalizar el contenido (no los anuncios), con el fin de ofrecer funciones de medios sociales y para recopilar datos estadísticos y de uso de forma anónima.",
    "DECLINE_DESCR_3": "Aún así acepto los Términos del Servicio y confirmo que tengo más de 16 años.",
    "EXIT": "No acepto. Salir ahora.",
    "CHOOSE_ACTION": "Por favor, escoge una opción",
    "ARE_YOU_SURE": "¿Estás seguro?",
    "GO_BACK": "Volver",
    "TOS_CONFIRMATION": "Al continuar usted acepta nuestros ##TOS_PLACEHOLDER##.",
    "TOS_URL_LABEL": "Términos del Servicio"
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  data: any = {};
  constructor() { }

  use(lang: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
      this.data = i18n[`${lang || 'en'}`];
      if (this.data) {
        resolve(this.data);
      } else {
        reject(`Language ${lang} not supported`);
      }
    });
  }

  get(key) {
    return this.data[key];
  }

  instant(key) {
    return this.data[key];
  }

}
