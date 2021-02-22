/**
 * @author xuanzai
 * @description 在线预览文件
 * @param {String} url
 */
function previewFile(url) {
  if (!url) {
    return
  }
  const
    strArr = url.split('.'),
    len = strArr.length,
    type = strArr[len - 1].toLowerCase(),
    iframe = document.createElement('iframe');
  iframe.style.cssText = `
            width: 100%;
            height: 100%;
        `;
  if (
    type == 'doc'
    || type == 'docx'
    || type == 'xls'
    || type == 'xlsx'
    || type == 'ppt'
    || type == 'pptx'
    || type == 'pdf'
    || type == 'jpg'
    || type == 'jpeg'
    || type == 'png'
    || type == 'txt'
    || type == 'rtf'
    || type == 'zip'
  ) {
    const newPage = window.open('', type);
    // iframe.src = `https://view.officeapps.live.com/op/view.aspx?src=${url}`;
    iframe.src = `http://view.xdocin.com/xdoc?_xdoc=${url}`;
    newPage.document.body.appendChild(iframe);
    newPage.document.body.style.margin = "0"
  } else {
    window.open(url)
  }
}

export default previewFile
