// export const environment = {
//   production: true,
//   baseUrl:"http://mysite"
// };
declare var Stripe:any;
export const environment = {
  production: true,
  baseUrl:"http://mysite",
  stripe : Stripe('dfsfsdfsdf'),
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