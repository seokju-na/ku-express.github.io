(function () {
    var app = window.app || {};

    function isAvailable() {
        return navigator.getVRDisplays !== undefined;
    }

    function getVRDisplay(callback) {
        if (!isAvailable()) {
            callback('browser not support vr display.', null);
            return;
        }

        navigator
            .getVRDisplays()
            .then(function (displays) {
                callback(null, displays[0]);
            })
            .catch(function (error) {
                callback(error, null);
            });
    }

    function getHelpMessageElement(callback) {
        var makeMessageElement = function (message) {
            var container = document.createElement( 'div' );
            container.style.position = 'absolute';
            container.style.left = '0';
            container.style.top = '0';
            container.style.right = '0';
            container.style.zIndex = '999';
            container.align = 'center';

            var error = document.createElement( 'div' );
            error.style.fontFamily = 'sans-serif';
            error.style.fontSize = '16px';
            error.style.fontStyle = 'normal';
            error.style.lineHeight = '26px';
            error.style.backgroundColor = '#fff';
            error.style.color = '#000';
            error.style.padding = '10px 20px';
            error.style.margin = '50px';
            error.style.display = 'inline-block';
            error.innerHTML = message;
            container.appendChild(error);

            callback(container);
        };

        getVRDisplay(function (err, vrDisplay) {
            if (err) {
                makeMessageElement('Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.');
            } else if (vrDisplay === null) {
                makeMessageElement('WebVR supported, but no VRDisplays found.');
            } else {
                callback(null);
            }
        });
    }

    function getButtonElement(callback) {

    }

    app.vrUtils = {
        isAvailable: isAvailable,
        getVRDisplay: getVRDisplay,
        getHelpMessageElement: getHelpMessageElement
    };

    window.app = app;
})();
