import {Page} from 'ionic-angular';

import {WifiSetup} from '../../components/wifi-setup/wifi-setup';

@Page({
    templateUrl: 'build/pages/page1/page1.html',
    directives: [WifiSetup]
})
export class Page1 {
    constructor() {

    }
}
