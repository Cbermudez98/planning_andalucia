declare var require: any;
import { Injectable } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { DocxMerger } from '@spfxappdev/docxmerger';

@Injectable({
  providedIn: 'root',
})
export class DocxDownloaderService {
  constructor() {}

  async generate(data: any[]) {
    const response = await fetch('/assets/template.docx');
    const templateContent = await response.arrayBuffer();
    const files: Blob[] = [];
    for (let obj of data) {
      files.push(this.doGenerate(templateContent, obj));
    }

    console.log(files);

    const mergedDoc = await this.mergeDocxFiles(files);
    console.log(
      '🚀  ~ DocxDownloaderService ~ generate ~ mergedDoc:',
      mergedDoc
    );
    saveAs(mergedDoc, 'output.docx'); // Save the merged document
  }

  private doGenerate(template: ArrayBuffer, data: any): Blob {
    const zip = new PizZip(template);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.render(data);
    return doc.getZip().generate({ type: 'blob' });
  }

  private async mergeDocxFiles(files: Blob[]): Promise<Blob> {
    try {
      const buffers = await Promise.all(
        files.map((file) => file.arrayBuffer())
      );
      console.log(
        '🚀  ~ DocxDownloaderService ~ mergeDocxFiles ~ buffers:',
        buffers
      );

      // Initialize DocxMerger
      const docMerger = new DocxMerger();
      console.log(
        '🚀  ~ DocxDownloaderService ~ mergeDocxFiles ~ docMerger:',
        docMerger
      );

      // Generate the merged document
      await docMerger.merge(buffers); // Save as Blob
      const buffer = await docMerger.save() as Blob;
      return new Blob([buffer]);
    } catch (error) {
      console.log(
        '🚀  ~ DocxDownloaderService ~ mergeDocxFiles ~ error:',
        error
      );
      throw error;
    }
  }
}
