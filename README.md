# Genesis
[![Build Status](https://travis-ci.org/adam-l/genesis.svg?branch=master)](https://travis-ci.org/adam-l/genesis)
[![npm version](https://badge.fury.io/js/genesis-fed.svg)](http://badge.fury.io/js/genesis-fed)
> Wise beginning of your next project


## Browser support
IE9+


## Directory structure
This section describes the project layout provided by Genesis.


```
├── dist/
│
├── docs/
│   └── resources/
│
├── node_modules/
│
├── src/
│   ├── components/
│   │
│   ├── fonts/
│   │
│   ├── images/
│   │
│   ├── media/
│   │
│   ├── scripts/
│   │   ├── _coffeescript/
│   │   │
│   │   └── javascript/
│   │
│   ├── stylesheets/
│   │   ├── _scss/
│   │   │
│   │   └── css/
│   │
│   └── templates/
│       ├── _swig/
│       │
│       └── html/
│
├── temp/
│
└── vendor/
```

**`dist`**  
This folder should be used only for deployment - making changes directly to the files located here is not recommended. Production files in this folder are generated from the source files located in the `src` folder. By default this folder is not tracked by the version control system.

The role of this folder is similiar to the role of folders often named `public`, `build` or `static` in other projects.

**`docs`**  
Use this folder to store documentation for the project. Different file formats can be used for documentation, for example: `md`, `rst`, `html`, `pdf`, `doc`. This folder can also contain graphic files.

**`docs/resources`**  
Any materials provided by stakeholders - logos, style guides, page layouts, project briefings and so on. In many cases this folder is going to contain graphic design files in the format of `psd`.

**`src`**  
The folder contains all the assets source files. This is where all development work is done. Compiled files are generated (either automatically or manually) in the distribution folder where they are waiting for deployment.

You may find this folder similiar to the `assets` folder in popular frameworks such as [Rails](http://edgeguides.rubyonrails.org/asset_pipeline.html#asset-organization), [Sails.js](http://sailsjs-documentation.readthedocs.org/en/latest/concepts/Assets/) or [Play](https://www.playframework.com/documentation/2.0/Anatomy#The-standard-application-layout).

## Not what you were looking for?
You were probably looking for this:

[![You were probably looking for this](http://img.youtube.com/vi/1FH-q0I1fJY/0.jpg)](https://www.youtube.com/watch?v=1FH-q0I1fJY)