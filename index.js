#!/usr/bin/env node
'use strict'

const path = require('path');
const program = require('commander')
const fs = require("fs")
const marked = require("marked")
const jsdom = require("jsdom")
const ejs = require("ejs")
const pdf = require('html-pdf')
const ncp = require('ncp').ncp

program
  .usage('-b base_path -o output_directory -t copyright')
  .option('-b, --base <value>', 'base_path')
  .option('-o, --out <value>', 'output_directory')
  .option('-t, --copyright <value>', 'copyright')
  .parse(process.argv)

const base_path = path.resolve(program.base);
const out_path = path.resolve(program.out);
const tmp_path = path.resolve(__dirname, '../resources');
const html_path = tmp_path + '/dist/docs/index.html';
const pdf_path = tmp_path + '/dist/pdf/document.pdf';
const assets_path = 'file://' + tmp_path + '/dist/docs/assets';

const copyright = program.copyright;
const dir_path = './dist/assets';

fs.readFile(base_path, "utf8", (err, file) => {
  if (err) {
    console.error(err);
    process.exit(err.code);
    return;
  }

  let renderer = new marked.Renderer();

  let title = '';
  let nav_html = '';
  renderer.heading = function (text, level, raw) {
    if (level == 1) {
      title = text;
      return '';
    }
    else if (level == 2) {

      let pattern = /\(.+\)/g;
      let result = text.match(pattern)[0].replace('(', '').replace(')', '').split(',');
      let tmp = text.match(pattern)[0];
      let formatted_text = text.replace(tmp, '');

      let val = formatted_text.replace(/\/|\{|\}/g, '');

      let html = '';
      html += `<div class="index" id="${val}">\n`;
      html += `<h${level} id="${val}">${formatted_text}</h${level}>\n`;

      html += '<ul>';
      result.forEach(function (_val, _index) {
        html += `<li class="${_val.toLowerCase()}">${_val}</li>\n`;
      })
      html += '</ul>';

      html += '</div>';

      nav_html += `<li id="list_${val}" class="type ${result[0].toLowerCase()}"><a href="#${val}">${formatted_text}</a></li>\n`;
      return html;
    }
    else {
      return `<h${level} id="${text}">${text}</h${level}>\n`
    }

  }

  renderer.html = function (html) {
    if (html.indexOf("<source>") != -1) {
      return html.replace('<source>', '<div class="source">');
    }
    if (html.indexOf("</source>") != -1) {
      return html.replace('</source>', '</div>');
    }
    if (html.indexOf("<request_table>") != -1) {
      return html.replace('<request_table>', '<div class="request_table">');
    }
    if (html.indexOf("</request_table>") != -1) {
      return html.replace('</request_table>', '</div>');
    }

    return;
  };


  renderer.list = function (body, ordered, start) {
    if (body.indexOf("<li>GET</li>") != -1) {
      return '<ul>' + body.replace('<li>GET</li>', '<li class="get">GET</li>') + '</ul>';
    }
    if (body.indexOf("<li>POST</li>") != -1) {
      return '<ul>' + body.replace('<li>POST</li>', '<li class="post">POST</li>') + '</ul>';
    }

    return '<ul>' + body + '</ul>';
  };

  renderer.table = function (header, body) {
    return '<div class="table_block"><table><thead>' + header + '</thead><tbody>' + body + '</tbody></table></div>';
  };

  // []付きのセルを編集
  renderer.tablerow = function (body) {
    let pattern = /\[.+\]/g;

    let result = body.match(pattern);
    if (result != null) {
      let tmp = body.replace(result[0], '');
      return '<tr class="child">' + tmp + '</tr>';
    }
    else {
      return '<tr>' + body + '</tr>';
    }
  };

  // []付きのセルを編集
  renderer.tablecell = function (body, flags) {
    if (flags.header) {
      return '<th>' + body + '</th>';
    }
    else {
      let tmp = body.replace('<em>*</em>', '<em class="required">required</em>');

      return '<td>' + tmp + '</td>';
    }
  };

  // code の特殊記法
  renderer.code = function (body, lang) {
    if (lang.indexOf(':') != -1) {
      let tmp_array = lang.split(':');

      return '<div class="source"><p><strong>' + tmp_array[1] + '</strong></p><pre><code class="hljs ' + tmp_array[0] + '">' + body + '</code></pre></div>'
    }
    else {
      return '<pre><code class="hljs ' + lang + '">' + body + '</code></pre>'
    }

    return body;
  };

  const html = marked(file, { renderer: renderer }); // HTML文字列に変換する

  const dom = new jsdom.JSDOM(html);
  const sources = dom.window.document.querySelectorAll('.source');

  sources.forEach((el) => {
    if (el.previousElementSibling.classList.value == 'source') {
      el.previousElementSibling.outerHTML = el.previousElementSibling.outerHTML.replace('source', 'source border')
    }
  });

  fs.writeFileSync(tmp_path + "/html/tmp/title.ejs", title)
  fs.writeFileSync(tmp_path + "/html/tmp/nav.ejs", nav_html)
  fs.writeFileSync(tmp_path + "/html/tmp/copy.ejs", process.env.npm_package_copy)
  fs.writeFile(tmp_path + "/html/tmp/markdown.ejs", dom.window.document.documentElement.innerHTML, (err) => {
    convertHTML();
  })
})

function convertHTML() {
  ejs.renderFile(tmp_path + '/html/src/index.ejs', (err, html) => {
    // テキストファイルに書き込む
    fs.writeFile(html_path, html, 'utf8', (err) => {
      if (err) {
        console.error(err);
        process.exit(err.code);
        return;
      }

      convertPDF();
    });
  });
}

function convertPDF() {
  const options = {
    "base": assets_path,
    "border": "10px",
    "footer": {
      "height": "20px",
      "contents": {
        default: '<div style="font-size: 8px; text-align: center; color: #333;">' + copyright + '</div>'
      }
    },
  };

  fs.readFile(html_path, "utf8", (err, file) => {
    if (err) {
      console.error(err);
      process.exit(err.code);
      return;
    }

    pdf.create(file, options).toFile(pdf_path, function (err, res) {
      if (err) return console.log(err);

      ncp.limit = 16;
      // dist を コピー
      ncp(tmp_path + '/dist/', out_path, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('done!');
      });
    });
  });

}