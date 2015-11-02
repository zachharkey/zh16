import dom from "../dom";
import * as util from "../util";


let $_jsStacks = null;


/**
 *
 * @public
 * @module stacked
 * @description Displays a stacked image style gallery.
 *
 */
const stacked = {
    /**
     *
     * @public
     * @method init
     * @memberof stacked
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "gallery:stacked initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof stacked
     * @description Method informs PageController of active status.
     * @returns {boolean}
     *
     */
    isActive () {
        return (this.getElements() > 0);
    },


    /**
     *
     * @public
     * @method onload
     * @memberof stacked
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        util.emitter.on( "app--scroll", onScroller );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof stacked
     * @description Method performs unloading actions for this module.
     *
     */
    unload () {
        this.teardown();
    },


    /**
     *
     * @public
     * @method teardown
     * @memberof stacked
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsStacks = null;

        util.emitter.off( "app--scroll", onScroller );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof stacked
     * @description Method queries DOM for this modules node
     * @returns {number}
     *
     */
    getElements () {
        $_jsStacks = dom.page.find( ".js-gallery-stacked" );

        return ( $_jsStacks.length );
    }
};


/**
 *
 * @private
 * @method execStack
 * @param {jQuery} $stack The gallery node
 * @memberof stacked
 * @description Init a stacked gallery.
 *
 */
const execStack = function ( $stack ) {
    $stack.addClass( "is-loaded" );

    util.loadImages( $stack.find( ".js-gallery-image" ), util.noop );
};


/**
 *
 * @private
 * @method onScroller
 * @memberof stacked
 * @description Handle scroll and init stacks.
 *
 */
const onScroller = function () {
    const $notLoaded = $_jsStacks.not( ".is-loaded" );
    let $stack = null;
    let i = $notLoaded.length;

    // All carousels loaded
    if ( !$notLoaded.length ) {
        util.emitter.off( "app--scroll", onScroller );
    }

    for ( i; i--; ) {
        $stack = $_jsStacks.eq( i );

        if ( util.isElementLoadable( $stack[ i ] ) ) {
            execStack( $stack );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default stacked;