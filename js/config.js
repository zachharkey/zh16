import detect from "./detect";


/**
 *
 * @public
 * @module config
 * @description Stores app-wide config values.
 *
 */
const config = {
    /**
     *
     * @public
     * @member sqsMaxImgWidth
     * @memberof config
     * @description The max width Squarespace allows for images.
     *
     */
    sqsMaxImgWidth: 2500,


    /**
     *
     * @public
     * @member sqsSpecialProps
     * @memberof config
     * @description Normalize access to certain item object properties for application.
     *
     */
    sqsSpecialProps: {
        published: "publishOn",

        // Any of these indicate a post HAS a thumbnail image.
        // Let's just use the `systemDataVariants` one as the default.
        // systemDataId
        // systemDataVariants
        // systemDataSourceType
        // systemDataOrigin
        userUpload: "systemDataVariants"
    },


    /**
     *
     * @public
     * @member hammerDefaults
     * @memberof config
     * @description The default options for Hammer JS.
     *
     */
    hammerDefaults: (detect.isTouch() ? null : {
        // Disable cssProps for non-touch experiences
        cssProps: {
            contentZoomingString: false,
            tapHighlightColorString: false,
            touchCalloutString: false,
            touchSelectString: false,
            userDragString: false,
            userSelectString: false
        }
    })
};



/******************************************************************************
 * Export
*******************************************************************************/
export default config;