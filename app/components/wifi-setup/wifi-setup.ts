import {Component, Inject, Input, ViewChild} from 'angular2/core';
import {CORE_DIRECTIVES, NgSwitch, NgSwitchWhen, NgSwitchDefault} from 'angular2/common';
import {HTTP_PROVIDERS, Http, Headers, RequestOptions} from 'angular2/http';
import {Button, Slides} from 'ionic-angular';
import {Hotspot} from 'ionic-native';
// import {Network, HotspotDevice} from 'ionic-native/types';
import {Network, HotspotDevice} from './waiting-for-drifty.interface';
import {Question, QuestionTypes} from './question.model';

@Component({
    selector: 'wifi-setup',
    templateUrl: 'build/components/wifi-setup/wifi-setup.html',
    // styleUrls: ['build/components/wifi-setup/wifi-setup.css']
    directives: [Slides, NgSwitch, NgSwitchWhen, NgSwitchDefault, CORE_DIRECTIVES],
    providers: [HTTP_PROVIDERS]
})
export class WifiSetup {
    @Input() IP: string;
    @Input('service-name') SERVICE_NAME: string = `Please set 'service-name'`;
    @Input('password') PASSWORD: string = `Please set 'password'`;

    @ViewChild('startSetupButton') startSetupButton: Button;
    @ViewChild('setupSlider') slider: Slides;
    private sliderOptions: Object = {
        pager: false,
        loop: false,
        direction: 'horizontal'
    };

    private device: {
        name: string;
        network?: Network;
        IP?: string;
        shortId?: string | number;
        id?: string | number;
    } = {
        name: this.SERVICE_NAME
    };

    private questions: Array<Question> = [];

    errs: Array<string> = [];

    private configuring: boolean = false;
    private readyToConfigure: boolean = false;
    private networks: Array<Network>;

    private QuestionTypes = QuestionTypes;

    constructor (@Inject(Http) private http) {
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
            this.configuring = false;

            this.slider.slideTo(2, 500, false);
        }).catch((err) => {
            this.configuring = false;

            this.errs.push(err);
        });
    }

    private startSetup (): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let network = this.idenfityNetwork();
            if (network) {
                this.device.shortId = network.SSID.substring(this.SERVICE_NAME.length - 1);
                this.connectToWiFi(network.SSID, this.PASSWORD).then(() => {
                    this.findDevice().then((deviceIP) => {
                        this.device.IP = deviceIP;
                        this.getQuestions(this.device.IP).then((questions) => {
                            this.questions = questions;
                            resolve();
                        })
                    })
                }).catch((err) => {
                    reject('Could not connect to network');
                })
            } else {
                reject('Network not found');
            }
        });
    }

    private clickSave (): void {
        this.saveSettings(this.device.IP, this.questions).then(() => {
            this.configuring = false;
        }).catch((err) => {
            console.log(err);
            this.errs.push(err);
            alert(err);
        })
    }

    private saveSettings (IP: string, questions: Array<Question>): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // TODO: send this.questions to server
            let body = JSON.stringify(questions);
            let headers = new Headers({'Content-Type': 'application/json'});
            let options = new RequestOptions({headers: headers});
            this.http.post(`${IP}/save-settings`, body, options)
                .map(res => res.json())
                .subscribe((res) => {
                    if (res.error) {
                        reject(res.error);
                    } else {
                        resolve(res);
                    }
                });
        });
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
            Hotspot.connectToWifi(SSID, password).then(() => {
                resolve();
            }).catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    private findDevice (): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.configuring) {
                Hotspot.getNetConfig().then((netConfig) => {
                    resolve(netConfig.gatewayIPAddress);
                });
            } else {
                // TODO: Implement this
                resolve('edyza.local');
                // Hotspot.getAllHotspotDevices().then((devices: Array<HotspotDevice>) => {
                //     console.log(devices);
                // });
            }
        });
    }

    private getQuestions (IP: string): Promise<Array<Question>> {
        return new Promise((resolve, reject) => {
            // TODO: Implement this
            // let questions: Array<Question> = [
            //     new Question(
            //         'WiFi SSID',
            //         'SSID',
            //         QuestionTypes.TEXT,
            //         /([\x00-\x7F]){1,32}/
            //     ),
            //     new Question(
            //         'WiFi password',
            //         'password',
            //         QuestionTypes.PASSWORD,
            //         /([\x00-\x7F]){8,63}/
            //     ),
            //     new Question(
            //         'Name',
            //         'name',
            //         QuestionTypes.TEXT
            //     )
            // ];

            this.http.get(`${IP}/questions`)
                .map(res => res.json())
                .subscribe((questions) => {
                    if (questions.error) {
                        reject(questions.error);
                    } else {
                        resolve(questions);
                    }
                });
        });
    }
}
