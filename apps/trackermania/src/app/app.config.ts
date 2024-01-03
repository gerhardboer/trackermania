import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { firebaseConfig, firebaseUiAuthConfig } from '../firebase.config';
import { FirebaseUIModule } from 'firebaseui-angular';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
      FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ]),
    provideRouter(appRoutes, withViewTransitions()),
    provideHttpClient(),
  ],
};
