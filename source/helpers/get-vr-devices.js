export default function getVr() {
    if (navigator.getVRDevices) {
        return navigator.getVRDevices()
            .then(getHmdAndSensor);
    } else {
        return Promise.resolve({
            hmd: null,
            sensor: null
        });
    }
}

function getHmdAndSensor(vrDevices) {

    var hmd = null;
    var sensor = null;

    for (var i = 0; i < vrDevices.length; ++i) {
        if (vrDevices[i] instanceof HMDVRDevice) {
            hmd = vrDevices[i];
            break;
        }
    }

    if (!hmd) {
        return Promise.resolve({
            hmd: null,
            sensor: null
        });
    }

    // Then, find that HMD's position sensor
    for (i = 0; i < vrDevices.length; ++i) {
        if (vrDevices[i] instanceof PositionSensorVRDevice &&
            vrDevices[i].hardwareUnitId === hmd.hardwareUnitId) {
            sensor = vrDevices[i];
            break;
        }
    }

    if (!sensor) {
        return Promise.reject('Found an HMD, but didn\'t find its orientation sensor?');
    }

    return {
        hmd: hmd,
        sensor: sensor
    };
}
