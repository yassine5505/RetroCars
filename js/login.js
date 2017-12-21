var GoogleAuth; // Google Auth object.
function initClient() {
  gapi.client.init({
      'apiKey': 'AIzaSyC0bVC3y5J-Sdwntwf_utPGsi59p05HR2U',
      'clientId': '603825168953-nm6t39iqfcsk8d8q3ssmduraqg9hvjh6.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
  }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);
  });

gapi.load('auth2' , function(){
  gapi.auth2.init();
})
function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('gSignIn', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
