import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { AttachedFile } from './interfaces/attached-file.interface';

interface StatusValidated {
  ok: boolean;
  message: string;
}

@Component({
  selector: 'app-attach-file',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="mt-1 items-centerrounded border border-solid border-gray-300 p-4"
    >
      <div class="text-center  justify-center items-center">
        @if (loadingFiles()) {
        <div
          class="text-center px-3 w-40 py-2 text-xs font-medium leading-none text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200"
        >
          Cargando archivos...
        </div>
        } @else {
        <label
          class="text-xl text-slate-500 text-center cursor-pointer block mb-0 font-medium dark:text-white"
          for="multiple_files"
        >
          Adjuntar Archivos
          </label
          >
          <span class="text-slate-400 text-sm">Máximo permitido {{maxSizeInMegaBytes}} Mb</span>
        }
      </div>

      <input
            (change)="onFileChange($event)"
            class="hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="multiple_files"
            type="file"
            multiple
          />
      @if (statusValidFilesZize().ok) {
       
        <ul
          class="items-center justify-center mt-2 space-y-1 text-left text-gray-500 dark:text-gray-400"
        >
          
          @for (file of attachedFiles(); track $index) {
  
          <li class="text-center items-center space-x-1 rtl:space-x-reverse">
            <span class="w-max ">
              <span class="max-w-50">{{ file.name }}</span>
              <span class="font-semibold text-gray-900 dark:text-white"
                >&nbsp; {{ file.size }}</span
              >
              <span
                (click)="removeFile($index)"
                class="pl-3 cursor-pointer text-lg font-extrabold text-red-600"
                >X</span
              >
            </span>
          </li>
          }
        </ul>
      } @else {
        <label
          class="text-sm text-red-600 text-center block mb-2 font-medium dark:text-white"
        >
          {{statusValidFilesZize().message}}</label>
      }

    </div>
  `,
  styles: `

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachFileComponent {

  attachedFiles = signal<AttachedFile[]>([]);
  loadingFiles = signal<boolean>(false);
  statusValidated: StatusValidated = {
    ok: true,
    message: ''
  }

  @Input({ required: true }) maxSizeInMegaBytes!: number;

  @Output() public emitAttachedFileEvent = new EventEmitter<AttachedFile[]>();

  public statusValidFilesZize = signal<StatusValidated>({ok: true, message: ''});

 

  validFilesSize(files: FileList): void {

    // const files: FileList = event.target.files;
    const maxSizeInMegaBytes = this.maxSizeInMegaBytes * 1024 * 1024;

    let totalFilesZize = 0;
    Array.from(files).forEach((file: File) => {
      totalFilesZize += file.size;
    });

    const ok = totalFilesZize <= maxSizeInMegaBytes;

    const message = !ok? `El tamaño de los archivos supera el máximo permitido`: '';

    this.statusValidFilesZize.set({ok, message});
    
  }

  onFileChange(event: any): void {

    
    const files: FileList = event.target.files;
  
    if (files.length > 0) {

      this.validFilesSize(files);
  
      if (this.statusValidFilesZize().ok) {
  
        const attachedFiles: AttachedFile[] = [];
        const promises: Promise<void>[] = [];
    
    
        this.loadingFiles.set(true);
    
        Array.from(files).forEach((file: File) => {
    
          const reader = new FileReader();
    
          const promise = new Promise<void>((resolve) => {
            reader.onload = (e: any) => {
    
              try {
                const base64Content: string = e.target.result;
          
                const attachedFile: AttachedFile = {
                  name: file.name,
                  base64: base64Content,
                  size: file.size,
                };
          
                attachedFiles.push(attachedFile);
                resolve();
              } catch (error) {
                console.log(error);
                
                reject(error);
              }
            };
          });
          promises.push(promise);
    
          reader.readAsDataURL(file);
        });
    
        Promise.all(promises).then(() => {
    
          this.loadingFiles.set(false);
          this.attachedFiles.set(attachedFiles);
    
          this.emitAttachedFileEvent.emit(this.attachedFiles());
        });
      }
    }
    


  }
  
  removeFile(index: number) {
    this.attachedFiles().splice(index, 1);
    
    this.emitAttachedFileEvent.emit(this.attachedFiles());
  }
}
function reject(error: unknown) {
  throw new Error('Function not implemented.');
}

