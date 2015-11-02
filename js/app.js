/*!
 *
 * App javascript
 *
 * Initializes Web App.
 *
 *
 */
import router from "./router";
import detect from "./detect";
import resizes from "./resizes";
import api from "./api";
import dom from "./dom";
import nav from "./menus/nav";
import intro from "./loading/intro";
import * as util from "./util";


/**
 *
 * @method modInit
 * @description Start modules that are NOT PageController plugs.
 *
 */
const modInit = function () {
    router.init();
    detect.init();
    resizes.init();
    nav.init();

    // Expose a global { app }
    window.app = {
        api,
        dom,
        nav,
        util,
        router,
        detect,
        resizes
    };
};


/**
 *
 * @method apiLoad
 * @description Loads Squarespace data for index=main.
 * @returns {object}
 *
 */
/*
const apiLoad = function () {
    return api.load( dom.nav.data() );
};
*/


/**
 *
 * @method appInit
 * @description Tears down the branded load screen Instrument.
 *
 */
const appInit = function () {
    intro.teardown();
};


/**
 *
 * @method Window.onload
 * @description Handles the Window.onload Event.
 *
 */
window.onload = function () {
    // Load { data } via API
    // This can be disabled if not using API
    //apiLoad().done( () => modInit() );


    // Initialize modules
    modInit();


    // Present content
    util.emitter.on( "app--preload-done", appInit );
};