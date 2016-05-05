import {Component} from 'angular2/core';

/*
Generated class for the WifiSetup component.

See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
for more info on Angular 2 Components.
*/
@Component({
    selector: 'wifi-setup',
    templateUrl: 'build/components/wifi-setup/wifi-setup.html',
    // styleUrls: ['build/components/wifi-setup/wifi-setup.css']
})
export class WifiSetup {
    text: string = '';

    constructor() {
        this.text = 'Hello World';
    }
}
