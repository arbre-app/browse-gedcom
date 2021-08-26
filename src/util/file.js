// https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
export const MIMETYPE_SVG = 'image/svg+xml';
export const MIMETYPE_PNG = 'image/png';
export const MIMETYPE_JPEG = 'image/jpeg';
export const MIMETYPE_PDF = 'application/pdf';

// https://stackoverflow.com/a/33542499/4413709
export const browserSaveFile = (filename, mimeType, data) => {
    const blob = new Blob([data], { type: mimeType });
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}
