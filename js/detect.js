import dom from "./dom";


/**
 *
 * @public
 * @module detect
 * @description Handles basic detection of touch devices.
 *
 */
const detect = {
    /**
     *
     * @public
     * @method init
     * @memberof detect
     * @description Initializes the detect module.
     *
     */
    init () {
        if ( this.isTouch() ) {
            dom.html.addClass( "is-touchable" );

        } else {
            dom.html.addClass( "is-hoverable" );
        }

        console.log( "detect initialized" );
    },


    /**
     *
     * @public
     * @method isTouch
     * @memberof detect
     * @description Check whether this is a touch device or not.
     * [See Modernizr]{@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js}
     * @returns {boolean}
     *
     */
    isTouch () {
        return ("ontouchstart" in window) || (window.DocumentTouch && document instanceof window.DocumentTouch);
    },


    /**
     *
     * @public
     * @method init
     * @memberof detect
     * @description Remove classNames applied by this module.
     *
     */
    teardown () {
        dom.html.removeClass( "is-touchable is-hoverable" );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default detect;