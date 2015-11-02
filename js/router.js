import $ from "jquery/dist/jquery.min";


import * as util from "./util";
import dom from "./dom";
import preload from "./preload";
import scrolls from "./scrolls";
import * as galleries from "./galleries";
import cover from "./cover";
import blocks from "./blocks";


import PageController from "properjs-pagecontroller";


const _pageDuration = util.getTransitionDuration( dom.page[ 0 ] );


/**
 *
 * @public
 * @module router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @member controller
     * @memberof router
     * @description Instance of [PageController]{@link  https://github.com/ProperJS/PageController}.
     *
     */
    controller: new PageController({
        transitionTime: _pageDuration
    }),


    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the [PageController]{@link  https://github.com/ProperJS/PageController} setup.
     *
     */
    init () {
        this.controller.setConfig([
            "*"
        ]);

        this.controller.setModules([
            scrolls,
            preload,
            cover,
            blocks,

            galleries.slideshow,
            galleries.slider,
            galleries.grid,
            galleries.stacked
        ]);

        this.controller.initPage();

        this.controller.on( "page-controller-router-transition-out", changePageOut );
        this.controller.on( "page-controller-router-refresh-document", changeContent );
        this.controller.on( "page-controller-router-transition-in", changePageIn );

        captureLinks();

        console.log( "router initialized" );
    },


    /**
     *
     * @public
     * @method route
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger app to route a specific page.
     *
     */
    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    /**
     *
     * @public
     * @method push
     * @param {string} path The uri to route to
     * @memberof router
     * @description Trigger a soft history push state.
     *
     */
    push ( path ) {
        this.controller.getPusher().push( path, util.noop );
    },


    /**
     *
     * @public
     * @method track
     * @param {string} type The object type, item or collection
     * @param {object} data The data context to track with
     * @memberof router
     * @description Track Squarespace Metrics since we are ajax-routing.
     *
     */
    track ( type, data ) {
        //console.log( "router:track:View", type, data );

        Y.Squarespace.Analytics.view( type, data );
    }
};


/**
 *
 * @private
 * @method onPreloadDone
 * @memberof router
 * @description Finish routing sequence when image pre-loading is done.
 *
 */
const onPreloadDone = function () {
    preload.triggerEvents();

    setTimeout( () => {
        dom.html.removeClass( "is-routing" );
        dom.page.removeClass( "is-reactive is-inactive" );

        scrolls.clearStates();

    }, _pageDuration );

    util.emitter.off( "app--preload-done", onPreloadDone );
};


/**
 *
 * @private
 * @method captureLinks
 * @memberof router
 * @description Suppress #hash links.
 *
 */
const captureLinks = function () {
    dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
};


/**
 *
 * @private
 * @method getStaticContext
 * @param {string} resHTML The responseText HTML string from router
 * @memberof router
 * @description Attempt to parse the Squarespace data context from responseText.
 * @returns {object}
 *
 */
const getStaticContext = function ( resHTML ) {
    // Match the { data } in Static.SQUARESPACE_CONTEXT
    let ctx = resHTML.match( /Static\.SQUARESPACE_CONTEXT\s=\s(.*?)\};/ );

    if ( ctx && ctx[ 1 ] ) {
        ctx = ctx[ 1 ];

        // Put the ending {object} bracket back in there :-(
        ctx = `${ctx}}`;

        // Parse the string as a valid piece of JSON content
        try {
            ctx = JSON.parse( ctx );

        } catch ( err ) {
            throw err;
        }

        // We now have the new pages context for Metrics
        //console.log( "router:getStaticContext", ctx );

    } else {
        ctx = false;
    }

    return ctx;
};


/**
 *
 * @private
 * @method changePageOut
 * @memberof router
 * @description Trigger transition-out animation.
 *
 */
const changePageOut = function () {
    dom.html.addClass( "is-routing" );
    dom.page.removeClass( "is-reactive" ).addClass( "is-inactive" );

    util.emitter.on( "app--preload-done", onPreloadDone );
};


/**
 *
 * @private
 * @method changeContent
 * @param {string} html The responseText as an HTML string
 * @memberof router
 * @description Swap the new content into the DOM.
 *
 */
const changeContent = function ( html ) {
    let ctx = null;
    const $doc = $( html );
    const res = $doc.filter( ".js-page" )[ 0 ].innerHTML;

    document.title = $doc.filter( "title" ).text();

    dom.page[ 0 ].innerHTML = res;

    ctx = getStaticContext( html );

    if ( ctx ) {
        router.track( (ctx.item ? "item" : "collection"), (ctx.item || ctx.collection) );
    }

    util.emitter.fire( "app--cleanup" );
};


/**
 *
 * @private
 * @method changePageIn
 * @memberof router
 * @description Trigger transition-in animation.
 *
 */
const changePageIn = function () {
    dom.page.addClass( "is-reactive" );
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;