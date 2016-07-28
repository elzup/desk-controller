var manager;

var k;
window.onload = function() {
    k = 0;
    manager = (new AudioManager({
        useMicrophone   : true,
        onEnterFrame    : function() {
            if (k++ == 10) {
                k = 0;
                console.log(Utils.sum(this.analysers.mic.getByteFrequencyData()));
            }
        }
    })).init();
}
