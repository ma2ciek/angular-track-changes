# CKEditor 5 real-time collaborative editing sample for Angular

This repository presents an integration of CKEditor 5 WYSIWYG editor including
[real-time collaboration features](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html) and [Angular](https://angular.io/).

## Quick start

1. Clone the repository:

   ```bash
   git clone git@github.com:ckeditor/ckeditor5-collaboration-samples.git
   cd ckeditor5-collaboration-samples/real-time-collaboration-for-angular
   ```

1. Open the `dist/index.html` page in the browser.

1. Fill the dialog with correct token, websocket and upload URL endpoints. If you do not have these yet or do not know their meaning, [contact us](https://ckeditor.com/contact/).

1. Copy the URL and share it or paste in another tab to enjoy real-time collaborative editing.

## Overview

The sample consist of an Angular application using CKEditor 5 with [real-time collaborative editing](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaboration.html). The application contains the editor with [presence list](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/users-in-real-time-collaboration.html#users-presence-list) and [a sidebar for real-time collaborative comments](https://ckeditor.com/docs/ckeditor5/latest/features/collaboration/real-time-collaboration/real-time-collaborative-comments.html).

It does not require the build step. However, if you want to modify the build, for instance to add more plugins, refer to the [creating own build](#creating-own-build) section below.

## File structure

The application consist of two parts - the Angular app (the `/` directory) and CKEditor 5 source code (inside the `vendor/ckeditor5/` directory). These separation of environments is required because we do not support [building CKEditor 5 sources inside the Angular environment yet](https://github.com/ckeditor/ckeditor5-angular/issues/26).

```bash
- dist/ # Built Angular application.
- src/
	- app/ # The core of the Angular application.
- vendor/
	- ckeditor/ 
		- src/ # Classic Editor with Real-time collaboration source.
		- build # Classic Editor with Real-time collaboration build.
		- webpack.config.js # Webpack configuration file to build CKEditor 5 sources.
```

The Angular part was supposed to be really simple, thus we removed test files and other files that are not necessary to run the application (for overall file structure including missing files see [Angular file structure guide](https://angular.io/guide/file-structure)).

The `EditorComponent` inside the `src/app/editor/editor-component.ts` uses the `<ckeditor>` Angular component, which is a wrapper for the Angular interface provided by the [@ckeditor/ckeditor5-angular](https://github.com/ckeditor/ckeditor5-angular) package.

To learn more about the integration and the `@ckeditor/ckeditor5-angular` package check out the [Angular integration guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html).

## Creating your own build

### Installing dependencies

If you want to customize the app, first, install all necessary dependencies in both parts of the project. To do it run the following commands from the main directory (`real-time-collaboration-for-angular/`):

```bash
npm install
cd vendor/ckeditor5
npm install
cd ../..
```

### Modifying CKEditor 5 editor

The CKEditor 5 build created for the purpose of this example is based on [classic editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/overview.html#classic-editor), but you can use any other [available CKEditor 5 editor](https://github.com/ckeditor/ckeditor5#editors) as a base. To change the editor base go to the `vendor/ckeditor5/src/classic-editor-with-real-time-collaboration.js` and change the `BaseEditor` class. Note that this step will require changing dependencies inside the `vendor/ckeditor5/package.json` and (installing them)[#installing-dependencies].

If you want to add plugin, then see the [CKEditor 5 Installing plugins guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installing-plugins.html#adding-a-plugin-to-an-editor) to learn more.

The webpack configuration for the building process is taken from `vendor/ckeditor5/webpack.config.js`. If you are familiar with webpack, you can play with this file to achieve a custom build that would fit your needs. You can check the [CKEditor 5 Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/advanced-setup.html#webpack-configuration) for some ready-to-use advanced configurations.

### Building application

To build the angular application make sure that `real-time-collaboration-for-angular/` is your current directory and run:

```bash
npm run build
```

This will build the editor to the `vendor/ckeditor5/build/` directory and then it will build the whole Angular application to the `dist/` directory. Then open `dist/index.html` file to test it.

Note that without touching the `vendor/ckeditor5` files once you'll make the first build you can use the `npm run start`  command that will run Angular dev server which will provide much faster rebuild times.
