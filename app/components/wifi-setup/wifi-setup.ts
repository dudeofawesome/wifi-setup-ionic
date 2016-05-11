import {Component, Inject, Input, ViewChild} from 'angular2/core';
import {Button, Slides} from 'ionic-angular';
import {Hotspot} from 'ionic-native';
import {Network} from './waiting-for-drifty.interface';
import {Question, QuestionTypes} from './question.model';

@Component({
    selector: 'wifi-setup',
    templateUrl: 'build/components/wifi-setup/wifi-setup.html',
    // styleUrls: ['build/components/wifi-setup/wifi-setup.css']
    directives: [Slides]
})
export class WifiSetup {
    @Input() IP: string;
    @Input('service-name') SERVICE_NAME: string = `Please set 'service-name'`;
    @Input('password') PASSWORD: string = `Please set 'password'`;
    // @Input() serviceName: string = '';
    // @Input() password: string = '';

    @ViewChild('startSetupButton') startSetupButton: Button;
    @ViewChild('setupSlider') slider: Slides;
    private sliderOptions: Object = {
        pager: false,
        loop: false,
        direction: 'horizontal'
    };

    private device: {
        name: string;
        network?: Network
    } = {
        name: this.SERVICE_NAME
    };

    errs: Array<string> = [];

    private configuring: boolean = false;
    private readyToConfigure: boolean = false;
    private networks: Array<Network>;

    constructor () {
        Hotspot.scanWifi().then((networks: Array<Network>) => {
            this.networks = networks;
            this.device.network = this.idenfityNetwork();
            this.device.name = this.device.network.SSID;
            if (this.device.network) {
                this.readyToConfigure = true;
            }
        }).catch((err) => {
            if (err === 'cordova_not_available') {
                this.networks = [
                    {
                        SSID: `${this.SERVICE_NAME}1234`,
                        BSSID: '00:00:00:00:00:00',
                        frequency: 2412,
                        level: -33,
                        timestamp: Date.now(),
                        capabilities: '[WPA2-PSK-CCMP][WPS][ESS]'
                    }
                ];
                this.device.network = this.idenfityNetwork();
                this.device.name = this.device.network.SSID;
                if (this.device.network) {
                    this.readyToConfigure = true;
                }
            } else {
                this.errs.push(err);
            }
        });
    }

    private clickStartSetup (): void {
        // console.log(this.startSetupButton);
        this.configuring = true;

        this.startSetup().then(() => {
            this.slider.slideTo(2, 500, false);
        }).catch((err) => {
            this.errs.push(err);
        });
    }

    private startSetup (): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let network = this.idenfityNetwork();
            if (network) {
                this.connectToWiFi(network.SSID, this.PASSWORD).then((success) => {
                    this.findDevice().then((deviceIP) => {
                        this.getQuestions(deviceIP).then((questions) => {
                            resolve();
                        })
                    })
                }).catch((err) => {
                    reject('Could not connect to network');
                })
            } else {
                reject('Network not found');
            }
        })
    }

    private idenfityNetwork (): Network | undefined {
        for (let i in this.networks) {
            if (this.networks[i].SSID.toLowerCase().includes(this.SERVICE_NAME.toLowerCase())) {
                return this.networks[i];
            }
        }
        return undefined;
    }

    private connectToWiFi (SSID: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            Hotspot.connectToHotspot(SSID, password).then((success) => {
                resolve(success);
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    private findDevice (): Promise<string> {
        return new Promise((resolve, reject) => {
            // TODO: Implement this
            resolve('192.168.42.1');
        });
    }

    private getQuestions (deviceIP: string): Promise<Array<Question>> {
        return new Promise((resolve, reject) => {
            // TODO: Implement this
            let questions: Array<Question> = [
                new Question(
                    'WiFi SSID',
                    'SSID',
                    QuestionTypes.TEXT,
                    /([\x00-\x7F]){1,32}/
                ),
                new Question(
                    'WiFi password',
                    'password',
                    QuestionTypes.PASSWORD,
                    /([\x00-\x7F]){8,63}/
                ),
                new Question(
                    'Name',
                    'name',
                    QuestionTypes.TEXT
                )
            ]
            resolve(questions);
        });
    }
}
