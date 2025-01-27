declare module 'docx-merger' {
  export default class DocxMerger {
    constructor(options: { pageBreak?: boolean }, files: ArrayBuffer[]);
    save(type: 'blob' | 'base64' | 'uint8array', callback?: Function): Blob | string | Uint8Array;
  }
}
