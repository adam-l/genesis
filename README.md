# Genesis
> Wise beginning of your next project

## Browser support
IE9+

## Directory structure
This section describes the project layout used in Genesis.

```
├── dist/
│
├── docs/
│   └── resources/
│
└── src/
    ├── components/
    │
    ├── fonts/
    │       
    ├── images/
    │
    ├── media/
    │
    ├── scripts/
    │   ├── _cofeescript/
    │   │
    │   ├── htc/
    │   │   └── vendor
    │   │       └── PIE.htc
    │   │
    │   └── javascript/
    │
    ├── stylesheets/
    │   ├── _scss/
    │   │
    │   └── css/
    │
    └── templates/
        ├── _swig/
        └── html/
```


`dist`
This folder should be used only for deployment. Production files in this folder are generated from the source files located in the `src` folder.  By default this folder is not tracked by the version control system.

The role of this folder is similiar to the role of folders often named `public`, `build` or `static` in other projects.

`docs`
Use this folder to store documentation for the project. Different file formats can be used for documentation, for example: ``md``, ``rst``, ``html``, ``pdf``, ``doc``. This folder can also contain graphic files.

`docs/resources`
Any materials provided by stakeholders - logos, style guides, page layouts, project briefings and so on. In many cases this folder is going to contain graphic design files in the format of ``psd``.

## Not what you were looking for?
You were probably looking for this:
[![You were probably looking for this](http://img.youtube.com/vi/1FH-q0I1fJY/0.jpg)](https://www.youtube.com/watch?v=1FH-q0I1fJY)