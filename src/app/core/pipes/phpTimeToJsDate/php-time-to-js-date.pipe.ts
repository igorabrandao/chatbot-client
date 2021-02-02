import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
    name: 'phpTimeToJsDate'
})
export class PhpTimeToJsDatePipe extends DatePipe implements PipeTransform {
    transform(value: number, pattern?: string): string {
        return super.transform(value * 1000, pattern);
    }
}
