export const fullScreen = (scene: Phaser.Scene) => {
    scene.scale.fullscreenTarget = document.getElementById("game");
    let F11Key = scene.input.keyboard.addCapture("F11");
    F11Key.on("down", () => {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen();
            console.log("Stop fullscreen");
        } else {
            scene.scale.startFullscreen();
            console.log("Start fullscreen");
        }
    });

    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    function exitHandler() {
        if (
            !document.fullscreenElement &&
            //@ts-ignore
            !document.webkitIsFullScreen &&
            //@ts-ignore
            !document.mozFullScreen &&
            //@ts-ignore
            !document.msFullscreenElement
        ) {
            console.log("Catch key escape event");
        }
    }
};
