Torus-apidoc-cli
====

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)][license]

[license]: https://github.com/axcelwork/torus-apidoc-cli/blob/master/LICENSE

## Overview
This is a command-line version of [Torus-apidoc] (https://github.com/axcelwork/torus-apidoc) that can create API documents with Markdown format documents.

## Requirement
This tool uses the following npm module.<br>
As it is described in package.json, it will be installed together.

### HTML compilation
- ejs
- ejs-cli

### Markdown to HTML
- jsdom
- marked

### HTML to PDF
- html-pdf

### Other
- commander
- ncp

## Install

```
npm install --save torus-apidoc-cli
```

## Usage
See `Torus-apidoc` for how to write Markdown text.

Command line:

```:json
torus-apidoc-cli -b doc/api.md -o dist/ -s 'Copyright &copy; Example1 Inc.'
```

### --base -b
The location and file name where Markdown is saved.

### --out -o
Directory to output HTML and PDF.

### --copyright -t
It is a copyright attached to the footer of the PDF file.

## Licence
[MIT](https://github.com/axcelwork/tool/blob/master/LICENCE)

## Author

[axcelwork](https://github.com/axcelwork)