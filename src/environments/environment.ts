// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

declare var Stripe:any;

export const environment = {
  production: false,
  // baseUrl:"http://localhost:8000",
  // baseUrl:"https://mysite",
  baseUrl:"https://shopping.mysite.in",
  stripe : Stripe('asdsdad'),
  paymentUrl:"https://api.stripe.com/v1/tokens",

  firebase:{
    apiKey: "apiKey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
  }
  
  
};




