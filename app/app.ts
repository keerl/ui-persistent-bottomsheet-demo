/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first page.
*/

import { svelteNativeNoFrame } from 'svelte-native'
import App from './App.svelte'

import { install } from '@nativescript-community/ui-persistent-bottomsheet';
install();

import BottomSheetElement from '@nativescript-community/ui-persistent-bottomsheet/svelte';
BottomSheetElement.register();

import * as app from '@nativescript/core/application';
import * as imageModule from '@nativescript-community/ui-image';
import { registerNativeViewElement } from 'svelte-native/dom';

registerNativeViewElement('nsImg', () => require('@nativescript-community/ui-image').Img);

app.on(app.launchEvent, () => imageModule.initialize({ isDownsampleEnabled: true }));
app.on(app.exitEvent, args => imageModule.shutDown());

svelteNativeNoFrame(App, {})
