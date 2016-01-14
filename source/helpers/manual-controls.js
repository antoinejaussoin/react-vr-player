export default function initialiseManualControls(keys, onRotate) {
    const manualControls = {};
    manualControls[keys.left.toLowerCase()] = {
        index: 1,
        sign: 1,
        active: 0
    };
    manualControls[keys.right.toLowerCase()] = {
        index: 1,
        sign: -1,
        active: 0
    };
    manualControls[keys.up.toLowerCase()] = {
        index: 0,
        sign: 1,
        active: 0
    };
    manualControls[keys.down.toLowerCase()] = {
        index: 0,
        sign: -1,
        active: 0
    };
    manualControls[keys.rotateLeft.toLowerCase()] = {
        index: 2,
        sign: 1,
        active: 0
    };
    manualControls[keys.rotateRight.toLowerCase()] = {
        index: 2,
        sign: -1,
        active: 0
    };

    enableKeyControls();

    function enableKeyControls() {
        function key(event, sign) {
            var control = manualControls[String.fromCharCode(event.keyCode).toLowerCase()];
            if (!control) {
                return;
            }
            if (sign === 1 && control.active || sign === -1 && !control.active) {
                return;
            }
            control.active = (sign === 1);
            onRotate(control.index, sign * control.sign);
            //webGl.rotate(control.index, sign * control.sign);
        }

        document.addEventListener('keydown', event => { key(event, 1); }, false);
        document.addEventListener('keyup', event => { key(event, -1); }, false);
    }
}
