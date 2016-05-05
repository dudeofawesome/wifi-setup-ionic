# wifi-setup-ionic

## Installation

1. Download and save the necessary `ionic-native` dependencies
    * `$ ionic plugin add cordova-plugin-network-information cordova-plugin-ble-central cordova-plugin-hotspot`
1. Add the `wifi-setup` directive to any `Page`s you want to use it on
    * ```
    @Page({
        templateUrl: 'build/pages/page1/page1.html',
        directives: [WifiSetup]
    })
    ```
1. Add the HTML tag to your `Page`'s template
    * `<wifi-setup></wifi-setup>`
