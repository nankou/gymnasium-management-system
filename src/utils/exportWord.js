import saveAs from 'file-saver'

function getModelHtml(html, style = '') {
  return `
	Content-Type: text/html; charset="utf-8"
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        ${style}
      </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `
}

/**
 * @author 王业鹏
 * @param {Object}
 * @description 导出word文档
 * */
export const exportWord = ({html, style, filename, selector}) => {
  if (selector) {
    let nodes = window.document.querySelectorAll(selector)
    html = nodes.length > 0 ? Array.from(nodes).reduce((a, b) => a + b.innerHTML, '') : ''
  }

  if (!html && !selector) {
    console.error("wordExport : missing html or selector");
    return;
  }
  if (typeof saveAs === "undefined") {
    console.error("wordExport : missing dependency (FileSaver.js)");
    return;
  }

  //没有模板引擎时，将获取节点的html字符串生成模板
  let MHtml = getModelHtml(html, style)

  let blob = new Blob([MHtml], {type: 'application/msword;charset=utf-8'})
  saveAs(blob, filename + '.doc')
}
