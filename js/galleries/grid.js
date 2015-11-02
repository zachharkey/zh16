import dom from "../dom";
import * as util from "../util";


let $_jsGrids = null;


/**
 *
 * @public
 * @module grid
 * @description Displays a gridded style gallery.
 *
 */
const grid = {
    /**
     *
     * @public
     * @method init
     * @memberof grid
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "gallery:grid initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof grid
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
     * @memberof grid
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
     * @memberof grid
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
     * @memberof grid
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsGrids = null;

        util.emitter.off( "app--scroll", onScroller );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof grid
     * @description Method queries DOM for this modules node
     * @returns {number}
     *
     */
    getElements () {
        $_jsGrids = dom.page.find( ".js-gallery-grid" );

        return ( $_jsGrids.length );
    }
};


/**
 *
 * @private
 * @method execGrid
 * @param {jQuery} $grid The grid node
 * @memberof grid
 * @description Initialize a grid gallery.
 *
 */
const execGrid = function ( $grid ) {
    $grid.addClass( "is-loaded" );

    util.loadImages( $grid.find( ".js-gallery-image" ), util.noop );
};


/**
 *
 * @private
 * @method onScroller
 * @memberof grid
 * @description Handle scroll event to init gallery grids.
 *
 */
const onScroller = function () {
    const $notLoaded = $_jsGrids.not( ".is-loaded" );
    let $grid = null;
    let i = $notLoaded.length;

    // All carousels loaded
    if ( !$notLoaded.length ) {
        util.emitter.off( "app--scroll", onScroller );
    }

    for ( i; i--; ) {
        $grid = $_jsGrids.eq( i );

        if ( util.isElementLoadable( $grid[ i ] ) ) {
            execGrid( $grid );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default grid;