import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
  fetch('/assets/env.json')
  .then(res => res.json())
  .then(env => {
    // Store it globally
    (window as any)['env'] = env;

    // Now boot the app
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });