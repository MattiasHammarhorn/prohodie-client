import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeSpan',
    standalone: true
})
export class TimeSpanPipe implements PipeTransform{
    transform(value: number): string {
        let seconds = Math.round(value % 60);
        let minutes = Math.floor((value / 60) % 60);
        let hours = Math.floor(value / (60 * 60));

        let secondsDisplay = seconds < 10 ? `0${seconds}` : `${seconds}`;
        let minutesDisplay = minutes < 10 ? `0${minutes}` : `${minutes}`;
        let hoursDisplay = hours < 10 ? `0${hours}` : `${hours}`;

        return `${hoursDisplay}:${minutesDisplay}:${secondsDisplay}`;
    }
}