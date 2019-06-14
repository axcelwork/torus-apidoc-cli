Torus-apidoc-cli
====

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)][license]

[license]: https://github.com/axcelwork/torus-apidoc-cli/blob/master/LICENSE

## Overview
Markdown形式のドキュメントでAPIドキュメントを作成することができる[Torus-apidoc](https://github.com/axcelwork/torus-apidoc)のコマンドライン版です。

## Requirement
このツールは以下のnpmモジュールを使用しています。<br>
package.jsonに記載されているので、まとめてインストールされます。

### HTML コンパイル
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
Markdownテキストについては、`Torus-apidoc`を見てください。


```:json
torus-apidoc-cli -b doc/api.md -o dist/ -s 'Copyright &copy; Example1 Inc.'
```

### --base -b
Markdownが保存されている場所とファイル名です。

### --out -o
HTMLとPDFを出力するディレクトリです。

### --copyright -t
PDFファイルのフッターにつくコピーライトです。



## Licence
[MIT](https://github.com/axcelwork/tool/blob/master/LICENCE)

## Author

[axcelwork](https://github.com/axcelwork)