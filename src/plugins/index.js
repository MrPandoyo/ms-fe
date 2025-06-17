/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import { createPinia } from 'pinia';
import router from '@/router'
import vuetify from './vuetify'
import persistState from 'pinia-plugin-persistedstate';

export function registerPlugins (app) {

  const persistPinia = createPinia();
  persistPinia.use(persistState);

  app
    .use(vuetify)
    .use(router)
    .use(persistPinia)
}
