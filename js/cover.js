import dom from "./dom";
import * as util from "./util";


let $_jsCover = null;


/**
 *
 * @public
 * @module cover
 * @description A nice description of what this module does...
 *
 */
const cover = {
    /**
     *
     * @public
     * @method init
     * @memberof cover
     * @description Method runs once when window loads.
     *
     */
    init () {
        console.log( "cover initialized" );
    },


    /**
     *
     * @public
     * @method isActive
     * @memberof cover
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
     * @memberof cover
     * @description Method performs onloading actions for this module.
     *
     */
    onload () {
        const data = $_jsCover.data();

        if ( data.tone === "light" ) {
            dom.html.addClass( "is-cover-page is-cover-light" );

        } else {
            dom.html.addClass( "is-cover-page" );
        }

        $_jsCover[ 0 ].style.marginTop = util.px( -dom.header[ 0 ].clientHeight );
    },


    /**
     *
     * @public
     * @method unload
     * @memberof cover
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
     * @memberof cover
     * @description Method performs cleanup after this module. Remmoves events, null vars etc...
     *
     */
    teardown () {
        $_jsCover = null;

        dom.html.removeClass( "is-cover-page is-cover-light" );
    },


    /**
     *
     * @public
     * @method getElements
     * @memberof cover
     * @description Method queries DOM for this modules node.
     * @returns {number}
     *
     */
    getElements () {
        $_jsCover = dom.page.find( ".js-cover" );

        return ( $_jsCover.length );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default cover;