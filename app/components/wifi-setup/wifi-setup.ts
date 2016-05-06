import {Component, Inject, Input} from 'angular2/core';
import {Hotspot} from 'ionic-native';

@Component({
    selector: 'wifi-setup',
    templateUrl: 'build/components/wifi-setup/wifi-setup.html',
    // styleUrls: ['build/components/wifi-setup/wifi-setup.css']
})
export class WifiSetup {
    @Input() IP: string;
    @Input('service-name') serviceName: string = '';

    err: string = '';

    private networks: Array<{
        SSID: string,
        BSSID: string,
        frequency: number,
        level: number,
        timestamp: number,
        capabilities: string
    }>;

    constructor() {
        Hotspot.scanWifi().then((networks) => {
            this.networks = networks;
        }).catch((err) => {
            if (err === 'cordova_not_available') {
                this.networks = [
                    {
                        SSID: 'string',
                        BSSID: 'string',
                        frequency: 0,
                        level: 0,
                        timestamp: 0,
                        capabilities: 'string'
                    }
                ]
            } else {
                this.serviceName = err;
            }
        });
    }
}
