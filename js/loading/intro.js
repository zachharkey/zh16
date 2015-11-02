import dom from "../dom";
import * as util from "../util";


const _transTime = util.getTransitionDuration( dom.intro[ 0 ] );


/**
 *
 * @public
 * @module intro
 * @description Performs the branded load-in screen sequence.
 *
 */
const intro = {
    /**
     *
     * @public
     * @method teardown
     * @memberof intro
     * @description Method removes loadin node from DOM.
     *
     */
    teardown () {
        dom.intro.removeClass( "is-active" );

        setTimeout( () => {
            dom.intro.remove();

            setTimeout( () => {
                dom.intro = null;

            }, 0 );

        }, _transTime );
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default intro;