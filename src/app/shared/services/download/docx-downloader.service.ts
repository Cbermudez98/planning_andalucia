declare var require: any;
import { Injectable } from '@angular/core';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { DocxMerger } from '@spfxappdev/docxmerger';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DocxDownloaderService {
  constructor() {}

  async generate(data: any[]) {
    const response = await fetch(environment.TEMPLATE.URL);
    const templateContent = await response.arrayBuffer();
    const files: Blob[] = [];
    for (let obj of data) {
      files.push(this.doGenerate(templateContent, obj));
    }

    const mergedDoc = await this.mergeDocxFiles(files);
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

      const docMerger = new DocxMerger();

      // Generate the merged document
      await docMerger.merge(buffers); // Save as Blob
      const buffer = (await docMerger.save()) as Blob;
      return new Blob([buffer]);
    } catch (error) {
      throw error;
    }
  }
}
