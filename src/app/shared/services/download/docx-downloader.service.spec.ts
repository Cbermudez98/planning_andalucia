import { TestBed } from '@angular/core/testing';

import { DocxDownloaderService } from './docx-downloader.service';

describe('DocxDownloaderService', () => {
  let service: DocxDownloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocxDownloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
