var manager;

window.onload = function() {
    manager = (new AudioManager({
        useMicrophone   : true,
        onEnterFrame    : function() {
            console.log(Utils.sum(this.analysers.mic.getByteFrequencyData()));
        }
    })).init();
}
