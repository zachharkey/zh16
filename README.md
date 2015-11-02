templar
=======

> A template for kick-starting a UI Development approach on projects.



## Overview
This is a work-in-progress starter template for working on Squarespace projects in a different way. If you have any questions about the process or approach, hit me up or open issues on this repo.



## Getting Started


### Clone
Clone this project to your local machine.
```shell
git clone git@github.com:kitajchuk/templar.git your_project
```

Then clone the Squarespace template into that clone.
```shell
cd your_project

# Templar is a starting point, so start anew
rm -rf .git

git clone https://yoursite.squarespace.com/template.git sqs_template
```

Then clone the jQuery repository for the custom build tool.
```
git clone git://github.com/jquery/jquery.git
```

Your Github repository should be on the `master` branch by default. Your Squarespace template will be on `master`. jQuery on `master` of course.

You'll also want to change some fields in the `package.json` file. Specifically the `title`, `name`, `description`, `repository`, `bugs`, `licenses`, and `contributors` fields.

As well, you'll want to completely change the `README.md` to describe your project's specifics.


### Install
Global tools.
```shell
npm install -g node-squarespace-server

# This is for jQuery custom builds
npm install -g grunt-cli

gem install sass
```

Local tools.
```shell
# Package dependencies
npm install

# This is the custom build this project uses, excluding all the cruft we don't prefer
cd jquery && npm run build

grunt custom:-deprecated,-effects,-css,-dimensions,-offset,-wrap,-exports/amd,-event/alias,-core/ready
```


### Workflow
Use the [node server](https://github.com/NodeSquarespace/node-squarespace-server) for local development.
```shell
# Run the server
sqs server

# Bust local cache
sqs buster
```

This project uses `npm` for task management. The format is `npm run [task]`. [This article](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool) is a good read on using npm as a build tool. The following are the configured tasks for this project.
```shell
# Build
build
build:js
build:css

# Watch
watch
watch:js
watch:sass

# Utility
lint:js
```

The best way to start your day.
```shell
sqs server

npm run watch
```


## Squarespace


### Base Template
This project bootstraps a totally custom `base-template` approach. The following steps will totally overwrite everything in your template you started with [here](http://developers.squarespace.com/get-started).
```shell
# Trash your current template.
# Delete everything other than .git
rm -rf sqs_template/.gitignore

find sqs_template/* -not -name '.git' | xargs rm -rf

# Copy the custom base-template over
cp -r .sqs_template/* sqs_template

# Trash the dot template
rm -rf .sqs_template

# Compile app JS/SASS and start project watch
npm run build
```

Once you have copied everything over, you'll want to update the `template.conf` file. You'll specifically want to modify the `name`, `author`, `server` and `customTypes` fields. After that you can wrap up the template update and push.

```shell
# Change directories
cd sqs_template

# Add your new template
git add .

# Commit your new template
git commit -m "Base template reset"

# Push the new template to your squarespace site
git push origin master

# Now initialize git on your top-level template
cd ..

git init

git remote add origin git@github.com:username/reponame.git

git commit -m "First commit."

git push -u origin master
```


### Sass vs Less
Squarespace uses [Less](http://lesscss.org/), however some people prefer [Sass](http://sass-lang.com/). I am one of those people. This template operates under the `Sass > Less` model and thus compiles your sass into your `sqs_template` as pure `CSS`. One known bug in the Squarespace Less compiler is that it does not correctly handle the [CSS calc](http://www.w3.org/TR/css3-values/#calc-notation) feature. In order to get around this you have to interpolate your use of `calc` in your Sass files. This syntax will produce the correct result as compiled through Sass and that result will produce the correct result as compiled through Less.

```css
/* Sass */
.foo {
    width: #{"calc( ~\"100% - 40px\" )"}
}

/* Sass -> CSS */
.foo {
    width: calc( ~"100% - 40px" );
}

/* CSS -> Less -> CSS */
.foo {
    width: calc( 100% - 40px );
}
```


### Block Overrides
It is entirely possible to override the block partials that Squarespace uses to render certain system blocks. This is uncharted territory, of course. It is totally useful in that it allows us to fully customize many aspects of the Squarespace template while retaining the flexibility of the CMS and its block options and configurations. The following explains how to override a system block. That is followed by a list of blocks we are currently taking this approach with.

To override a system block, inspect it's block type name. This is actually discovered in the className property of the rendered block element. For instance, an image block has this className: `sqs-block image-block sqs-block-image`. So the block type is `image`. Easy. If we make an `image.block` along with `image.block.conf` we successfully override the partial used to render this system block thus swapping our block partial for Squarespace's.

In order for this to work, your `.conf` file needs a small snippet of JSON. This is what that would look like for the `image.block.conf` file. You can see the pattern in just using the block type name.

```javascript
{
    "type": "image"
}
```

In order to render your block override successfully, you'll have to inspect the context data passed to that file during the render cycle. The local node server cannot load and utilize your block overrides locally, so you have to dump the context data in your file and push it up to the Squarespace site to review it. I typically do this via the following. After pushing you can refresh locally with the `?nocach` query string and see a console log of the context data passed to the block.

```html
<script>console.log( {@|json-pretty} );</script>
```

In practice I have developed a formatting style for overridden block partials that will onboard developers into what is going on if they don't have much familiarity with the Squarespace platform. The quote block partial on this project is a good example of what this looks like. Depending on the block type, the data context could be more robust than this.

```html
{###############################################################################
    BLOCK OVERRIDE
    This file, in conjunction with its `.conf` file,
    are overriding the Squarespace system default rendering for this block type.

    OBJECT MODEL
    =>


        quote:          string
        source:         string
###############################################################################}
<figure class="bq">
    <blockquote class="bq__quote">{quote|safe}</blockquote>
    <figcaption class="bq__source meta -grey">{source|safe}</figcaption>
</figure>




{###############################################################################
    How to view the json context for this block partial

    1. Paste this script outside of this ignored comment
    2. Push to master for the template
    3. Refresh your page with the ?nocache query string

    <script>console.log( {@|json-pretty} );</script>
###############################################################################}
```


## Best Practices


### ESLint
This project uses [ESLint](http://eslint.org/) for code consistency. The `.eslintrc` is a carefully curated set of definitions covering most all rules available.


### Webpack, Babel & ES6
This project is using [webpack](https://webpack.github.io/) for local module dependencies as well as [babel](http://babeljs.io/) for ES6 syntax transpiling. A number of the ESLint rules establish a preference for ES6 syntax over ES5, so time to start fat-arrowing your Class no-vars :P


### Hammer
All events are normalized using [Hammer.js](http://hammerjs.github.io) unless they are events that cannot be wrapped in a touch interface, such as mousing or form binding. A handy [ProperJS](https://github.com/ProperJS) wrapper called [Hammered](https://github.com/ProperJS/Hammered) is used for event delegation when adding Hammer listeners. Checkout the [Getting Started](http://hammerjs.github.io/getting-started/) page for usage tips. Also check out [this post](http://tech.gilt.com/2014/09/23/five-things-you-need-to-know-about-hammer-js-2-0/) for insights on how best to utilize the Hammer 2 API if you are shifting from the 1.0 Pub/Sub model.


### jQuery
Checkout [this page](https://learn.jquery.com/performance/) to familiarize yourself with some best practices when working with jQuery and the DOM. Aside from that, these are some other good ones.
- Cache your elements
- Cache elements when a module deems it necessary only
- Use high-level caching for document, html and body
- Use native value over .val()
- Use native innerHTML over .html()
- Never use .each(), rather use native loops
- Query with context, either $( selector, context ) OR $element.find( selector )



## Testing
Perform the setup steps above using [this Squarespace account in Developer mode](https://templar-test.squarespace.com/).
```shell
# Developing templar locally means some steps can be skipped
# The following is the move for generating the control test scenario
# The sqs-loc command is a Fish function that runs my local clone of the node-squarespace-server

# Fresh clone of the site, which is a base-template starting point
git clone https://templar-test.squarespace.com/template.git sqs_template

# Fresh install of all dependencies
npm install

# Trash everything in the Squarespace template
rm -rf sqs_template/.gitignore and find sqs_template/* -not -name '.git' | xargs rm -rf

# Copy the custom base-template over
cp -r .sqs_template/* sqs_template

# Don't trash the dot template here

# Compile sass and javascript into template
npm run build

# Run the server on the template
cd sqs_template

sqs-loc

# The most important part of testing:
# Don't commit or push back to the Squarespace site!
# Instead, once you test locally, do this:

cd ..

rm -rf sqs_template
```



## Pull Requests
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
