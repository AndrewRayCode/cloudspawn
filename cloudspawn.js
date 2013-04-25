(function() {

// See README for options
$.fn.cloudSpawn = function(options) {

    // get out if we're spawned
    if(this.data('cloudSpawn')) {
        return this;
    }
    options = options || {};

    var topBubbles = [],
        bottomBubbles = [],
        $this = this,
        startWidth = $this.width(),
        startHeight = $this.height();

    // Option defaults
    var counter = startWidth,
        minDist = options.minDist || 30,
        maxDist = options.maxDist || 110,
        maxOverlap = options.maxOverlap || 15,
        minOverlap = options.minOverlap || 10,
        radius, started, circ;

    // inner util function
    var randInt = function(min, max) {
        return (Math.floor(Math.random() * (max - min + 1))) + min;
    };

    // Create a bubble
    var makeCircle = function(left, radius, bottom) {
        return {
            $elem: $('<div class="cloud-bubble' + (bottom ? ' cloud-bubble-bottom' : '') + '"></div>').css({
                left: left,
                top: bottom ? startHeight - radius : -radius,
                width: radius * 2,
                height: radius * 2
            }),
            radius: radius,
            left: left,
            curWidth: 0,

            // Move the bubble into place
            move: function(exposed) {
                var visible = (this.left + this.radius * 2) - (startWidth - exposed);
                this.$elem.css({
                    width: visible,
                    height: visible,
                    top: bottom ? startHeight - visible / 2 : -visible / 2,
                    left: this.left + (this.radius * 2 - visible)
                });

                // If fully visible, we're done. If fully invisible, we're
                // popped. Use a 0.1 margin of error
                this.done = visible - 0.1 >= this.radius * 2;
                this.popped = visible - 0.1 <= 0;
            }
        };
    };

    // build the top row of bubbles
    while (counter > 0) {
        radius = randInt(minDist / 2, maxDist / 2);
        counter -= ((radius * 2) - (started ? randInt(maxOverlap, minOverlap) : 0 ));
        circ = makeCircle(counter, radius);
        topBubbles.push(circ);
        circ.$elem.appendTo($this);
        started = true;
    }

    // build the bottom row of bubbles
    counter = startWidth;
    started = false;
    while (counter > 0) {
        radius = randInt(minDist / 2, maxDist / 2);
        counter -= ((radius * 2) - (started ? randInt(maxOverlap, minOverlap) : 0 ));
        circ = makeCircle(counter, radius, true);
        bottomBubbles.push(circ);
        circ.$elem.appendTo($this);
        started = true;
    }

    // Save all our data
    this.data('cloudSpawn', {
        topBubbles: topBubbles,
        bottomBubbles: bottomBubbles,
        startWidth: startWidth,
        startHeight: startHeight,
        duration: options.duration || 2500
    });

    return this;
};

// Swip the element in from the left
$.fn.cloudSpawnShow = function(options) {
    var data;
    options = options || {};
    data = this.data('cloudSpawn');

    if(data.showing || data.hiding || data.shown) {
        return this;
    }
    data.showing = true;

    var topBubbles = data.topBubbles,
        bottomBubbles = data.bottomBubbles,
        startWidth = data.startWidth,
        startHeight = data.startHeight;
        topBubIndex = 0,
        bottomBubIndex = 0;

    return this.stop().animate({
        left: 0
    }, {
        duration: options.duration || data.duration,

        // Every time the animation updates...
        step: function(now) {
            var bub = topBubbles[topBubIndex],
                nextBub = topBubbles[topBubIndex + 1];

            // Place the top bubbles
            var exposed = (startWidth + now);
            bub.move(exposed);
            if(nextBub) {
                nextBub.move(exposed);
            }
            // tell the next bubble to start updating if this one is fully
            // visible
            if(bub.done) {
                topBubIndex++;
            }

            // place the bottom bubbles
            var bBub = bottomBubbles[bottomBubIndex],
                nextbBub = bottomBubbles[bottomBubIndex + 1];
            
            bBub.move(exposed);
            if(nextbBub) {
                nextbBub.move(exposed);
            }
            if(bBub.done) {
                bottomBubIndex++;
            }
        }
    }).promise().then(function() {
        data.shown = true;
        delete data.hiding;
        delete data.hidden;
        delete data.showing;
    });
};

// Swipe the element from right to left, off screen
$.fn.cloudSpawnHide = function(options) {
    var data = this.data('cloudSpawn');
    if(data.showing || data.hiding || data.hidden) {
        return this;
    }

    var topBubbles = data.topBubbles,
        bottomBubbles = data.bottomBubbles,
        startWidth = data.startWidth,
        startHeight = data.startHeight;
        topBubIndex = topBubbles.length - 1,
        bottomBubIndex = bottomBubbles.length - 1;

    options = options || {};
    data.hiding = true;

    return this.stop().animate({
        left: -startWidth
    }, {
        duration: options.duration || data.duration,
        step: function(now) {
            var bub = topBubbles[topBubIndex],
                nextBub = topBubbles[topBubIndex + 1];

            // top bubbles
            var exposed = (startWidth + now);
            if(bub) {
                bub.move(exposed);

                if(bub.popped) {
                    topBubIndex--;
                }
                if(nextBub) {
                    nextBub.move(exposed);
                }
            }

            // bottom bubbles
            var bBub = bottomBubbles[bottomBubIndex],
                nextbBub = bottomBubbles[bottomBubIndex + 1];
            if(bBub) {
                bBub.move(exposed);

                if(nextbBub) {
                    nextbBub.move(exposed);
                }
                if(bBub.popped) {
                    bottomBubIndex--;
                }
            }
        }
    }).promise().then(function() {
        data.hidden = true;
        delete data.hiding;
        delete data.showing;
        delete data.shown;
    });
};

}());
