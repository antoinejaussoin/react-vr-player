export default function goFullScreen(canvas, devices, fullScreen) {
    if (fullScreen) {
        if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen({
                vrDisplay: devices.hmd
            }); // Firefox
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen({
                vrDisplay: devices.hmd
            }); // Chrome and Safari
        } else if (canvas.requestFullScreen) {
            canvas.requestFullscreen();
        }
    }
}
