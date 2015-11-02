import * as config from "./config";
import $ from "jquery/dist/jquery.min";
import paramalama from "paramalama";


let _cache = {};
const _rSlash = /^\/|\/$/g;


/**
 *
 * @private
 * @method _slug
 * @param {string} uri The string to slugify
 * @memberof api
 * @description Slug a uri string
 * @returns {string}
 *
 */
const _slug = function ( uri ) {
    return uri.replace( _rSlash, "" ).replace( /\/|\?|\&|=/g, "-" ).toLowerCase();
};


/**
 *
 * @public
 * @module api
 * @description Provide some api methods for accessing content via JS.
 *
 */
const api = {
    /**
     *
     * @public
     * @member data
     * @memberof api
     * @description URLs this little api needs to use.
     *
     */
    data: {
        siteurl: location.origin,
        siteapi: [location.origin, "api"].join( "/" )
    },


    /**
     *
     * @public
     * @method urify
     * @param {string} uri The collection uri
     * @memberof api
     * @description Ensures a leading/trailing slash.
     * @returns {string}
     *
     */
    urify ( uri ) {
        return ["/", uri.replace( _rSlash, "" ), "/"].join( "" );
    },


    /**
     *
     * @public
     * @method endpoint
     * @param {string} uri The collection uri
     * @memberof api
     * @description Creates the fullUrl from a collection uri.
     * @returns {string}
     *
     */
    endpoint ( uri ) {
        return [this.data.siteurl, uri.replace( _rSlash, "" )].join( "/" );
    },


    /**
     *
     * @public
     * @method apipoint
     * @param {string} uri The API uri
     * @memberof api
     * @description Creates the fullUrl from an API uri.
     * @returns {string}
     *
     */
    apipoint ( uri ) {
        return [this.data.siteapi, uri.replace( _rSlash, "" )].join( "/" );
    },


    /**
     *
     * @public
     * @method request
     * @param {string} url The API URL
     * @param {object} params Merge params to send
     * @memberof api
     * @description Creates the fullUrl from an API uri.
     * @returns {object}
     *
     */
    request ( url, params ) {
        const data = $.extend( true, { format: "json", nocache: true }, params );

        return $.ajax( { url, data, dataType: "json", type: "GET" } );
    },


    /**
     *
     * @public
     * @method index
     * @param {string} uri The index uri
     * @param {object} params Merge params to send
     * @memberof api
     * @description Retrieves collections from a given index.
     * @returns {object}
     *
     */
    index ( uri, params ) {
        let i = 0;
        const def = new $.Deferred();
        const colls = [];
        const cached = this.cache( "index", uri );
        const handle = function ( data ) {
            for ( i = data.collections.length; i--; ) {
                // Disable this condition to load EVERYTHING...?
                if ( data.collections[ i ].typeName === config.defaultCollection ) {
                    colls.push( data.collections[ i ].urlId );
                }
            }

            api.collections( colls, params ).done( ( items ) => def.resolve( items ) );
        };

        if ( cached ) {
            setTimeout( () => handle( cached ), 1 );

        } else {
            this.request( this.endpoint( uri ) )
                .done( ( data ) => {
                    api.cache( "index", data.collection.urlId, data.collection );

                    handle( data.collection );

                })
                .fail( ( xhr, status, error ) => def.reject( error ) );
        }

        return def;
    },


    /**
     *
     * @public
     * @method collection
     * @param {string} uri The collection uri
     * @param {object} params Merge params to send
     * @memberof api
     * @description Retrieves items from a given collection.
     * @returns {object}
     *
     */
    collection ( uri, params ) {
        let collection = {};
        const def = new $.Deferred();
        const cached = this.cache( config.defaultCollection, uri );
        const seg = uri.split( "?" )[ 0 ];

        params = $.extend( true, (params || {}), paramalama( uri ) );

        if ( cached ) {
            setTimeout( () => def.resolve( cached.items ? cached : null ), 1 );

        } else {
            this.request( this.endpoint( seg ), params )
                .done( ( data ) => {
                    // Collection?
                    collection = {
                        collection: data.collection,
                        item: (data.item || null),
                        items: (data.items || null),
                        pagination: (data.pagination || null)
                    };

                    api.cache(
                        data.collection.typeName,
                        uri,
                        collection
                    );

                    def.resolve( (data.items || data.item) ? collection : null );

                })
                .fail( ( xhr, status, error ) => def.reject( error ) );
        }

        return def;
    },


    /**
     *
     * @public
     * @method collections
     * @param {array} uris The collection uris to query for
     * @param {object} params Merge params to send
     * @memberof api
     * @description Retrieves items from a given set of collection.
     * @returns {object}
     *
     */
    collections ( uris, params ) {
        let curr = 0;
        let i = uris.length;
        const items = {};
        const def = new $.Deferred();
        const func = function ( uri, data ) {
            curr++;

            if ( data ) {
                items[ uri ] = data;
            }

            if ( curr === uris.length ) {
                def.resolve( items );
            }
        };

        for ( i; i--; ) {
            this.collection( uris[ i ], params ).done( func.bind( null, uris[ i ] ) );
        }

        return def;
    },


    /**
     *
     * @public
     * @method load
     * @param {object} data The data hash
     * @memberof api
     * @description Used to get initial payload, ideally an index of collections.
     * @returns {object}
     *
     */
    load ( data ) {
        let ret = null;

        _cache = {};

        if ( data.index ) {
            ret = this.index( data.index );

        } else if ( data.collection ) {
            ret = this.collection( data.collection );
        }

        return ret;
    },


    /**
     *
     * @public
     * @method cache
     * @param {string} type The data-type
     * @param {string} id The collection urlId
     * @param {object} val The optional value to assign
     * @memberof api
     * @description Setter/Getter for internal cache store.
     * @returns {object}
     *
     */
    cache ( type, id, val ) {
        let ret = null;

        id = id ? _slug( id ) : id;

        // Exists?
        if ( !_cache[ type ] && type ) {
            _cache[ type ] = {};
        }

        // Assign?
        if ( val ) {
            _cache[ type ][ id ] = val;

            ret = $.extend( true, $.isArray( val ) ? [] : {}, val );

        // Access?
        } else if ( type ) {
            if ( id ) {
                ret = _cache[ type ][ id ] ? $.extend( true, $.isArray( _cache[ type ][ id ] ) ? [] : {}, _cache[ type ][ id ] ) : null;

            } else {
                ret = _cache[ type ] ? $.extend( true, $.isArray( _cache[ type ] ) ? [] : {}, _cache[ type ] ) : null;
            }

        // Everything?
        } else {
            ret = $.extend( true, {}, _cache );
        }

        return ret;
    },


    /**
     *
     * @public
     * @method search
     * @param {string} query The query term
     * @memberof api
     * @description Retrieves search results for a term using Squarespace GeneralSearch api endpoint.
     * @returns {object}
     *
     */
    search ( query ) {
        let i = 0;
        let item = {};
        const def = new $.Deferred();
        const items = [];
        const cached = this.cache( "search", query );

        if ( cached ) {
            setTimeout( () => def.resolve( cached ? cached : null ), 1 );

        } else {
            this.request( this.apipoint( "search/GeneralSearch" ), { q: query } )
                .done( ( data ) => {
                    // Normalize the search results to reflect a collection item
                    for ( i = data.items.length; i--; ) {
                        if ( data.items[ i ].imageUrl ) {
                            item = {};
                            item.title = data.items[ i ].title;
                            item.fullUrl = data.items[ i ].itemUrl;
                            item.assetUrl = data.items[ i ].imageUrl;
                            item.categories = data.items[ i ].categories;
                            item[ config.sqsSpecialProps.userUpload ] = config.sqsMaxImgWidth;

                            items.push( item );
                        }
                    }

                    api.cache( "search", query, items );

                    def.resolve( items );
                })
                .fail( ( xhr, status, error ) => def.reject( error ) );
        }

        return def;
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default api;