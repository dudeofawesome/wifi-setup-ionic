import {Component, Inject} from 'angular2/core';
import {Hotspot, Network, Connection} from 'ionic-native';

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
    private hostpost: Hotspot;

    text: string = '';

    constructor(@Inject(Hotspot) hotspot: Hotspot) {
        this.text = 'Hello World';
        debugger;
    }
}
