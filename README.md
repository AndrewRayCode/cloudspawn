Cloudspawn jQuery Plugin
========================

Swipe in an elment from the left, styled like a cloud, with animated puffs.

## [Demo](http://jsfiddle.net/delvarworld/vVFxS/7/)

## Usage

Include `cloudspawn.js` and `cloudspawn.css` on your page.

Suggested HTML:

    <div class="container" id="cloudspawn">
        <div class="content">
            ... content ...
        </div>
    </div>

Make your container element have similar CSS as:

    .container {
        position:absolute; /* required */
        background:#fff;   /* if you change this, change .bubble background */
        left:-400px;       /* negative distance of width */

        /* following are up to you */
        top:60px;
        width:400px;
        height:150px;
    }

Then DO IT:

    $('#cloudspawn').cloudSpawn().cloudSpawnShow();

## Methods

$().cloudSpawn(options)

    All options are ... optional :)

    minDist
        Minimum distance (in pixels) between bubble center points. Think of
        this as the minimum bubble radius.

    maxDist
        Maximum distance (in pixels) between bubble center points. Think of
        this as the maximum bubble radius.

    minOverlap
        Minimum amount (in pixels) that bubbles will overlap.

    maxOverlap
        Maximum amount (in pixels) that bubbles will overlap.

$().cloudSpawnShow(options)

    duration (optional)
        How long the entire revealing animation will last

$().cloudSpawnHide(options)

    duration (optional)
        How long the entire hiding animation will last

## Notes

If you wish to add padding, add it to `.content`, not `.container`. Otherwise,
you may omit the `.content` element.

You can change the color of the cloud by changing the background color of the
`.container` element as well as the `.bubble` element. The bottom bubbles also
have a class of .bubble-bottom if you wish to style them differently.

Chaining when it's done is easy enough, just listen for the animation to finish

    $(elem).cloudSpawnShow().promise().then(function() { alert('animation done'); });

Not tested on mobile browsers. Will probably catch on fire.

Never license your code.
