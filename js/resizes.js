import * as config from "./config";
import * as util from "./util";


let _isSmallOn = false;
let _isTallOn = false;
let _isSmall = (window.innerWidth <= config.mobileWidth);
let _isTall = (window.innerHeight > window.innerWidth);


/**
 *
 * @public
 * @module resizes
 * @description Handles app-wide emission of various resize detection events.
 *
 */
const resizes = {
    /**
     *
     * @public
     * @method init
     * @memberof resizes
     * @description Method binds event listeners for resize controller.
     *
     */
    init () {
        util.resizer.on( "resize", onResizer );
        util.emitter.on( "app--do-resize", onResizer );

        onResizer();

        console.log( "resizes initialized" );
    },


    /**
     *
     * @public
     * @method isSmall
     * @memberof resizes
     * @description Method checks if the window size is `small`.
     * @returns {boolean}
     *
     */
    isSmall () {
        return _isSmall;
    },


    /**
     *
     * @public
     * @method isTall
     * @memberof resizes
     * @description Method checks if the window size is `tall`.
     * @returns {boolean}
     *
     */
    isTall () {
        return _isTall;
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof resizes
     * @description Method unbinds resize event handlers.
     *
     */
    teardown () {
        util.resizer.off( "resize", onResizer );
        util.emitter.off( "app--do-resize", onResizer );
    }
};


/**
 *
 * @private
 * @method onResizer
 * @memberof resizes
 * @description Method handles the window resize event via [ResizeController]{@link https://github.com/ProperJS/ResizeController}.
 *
 */
const onResizer = function () {
    _isSmall = (window.innerWidth <= config.mobileWidth);
    _isTall = (window.innerHeight > window.innerWidth);

    if ( _isSmall && !_isSmallOn ) {
        _isSmallOn = true;

        util.emitter.fire( "app--resize-small" );

    } else if ( !_isSmall && _isSmallOn ) {
        _isSmallOn = false;

        util.emitter.fire( "app--resize-normal" );
    }

    if ( _isTall && !_isTallOn ) {
        _isTallOn = true;

        util.emitter.fire( "app--resize-tall" );

    } else if ( !_isTall && _isTallOn ) {
        _isTallOn = false;

        util.emitter.fire( "app--resize-wide" );
    }

    util.emitter.fire( "app--resize" );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default resizes;