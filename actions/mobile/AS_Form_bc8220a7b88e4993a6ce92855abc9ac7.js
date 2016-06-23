function AS_Form_bc8220a7b88e4993a6ce92855abc9ac7() {
    function SCALE_ACTION____dccf50ef33dc4993abf95b04ca70f5e4_Callback() {}

    function TRANSFORM_ACTION_NEW____05f127fb1613425b9bd30cb1a12594a3_Callback() {}
    var trans100 = kony.ui.makeAffineTransform();
    trans100.scale(0, 0);
    frmHome["flxSplash"].animate(kony.ui.createAnimation({
        "100": {
            "stepConfig": {
                "timingFunction": kony.anim.EASE
            },
            "transform": trans100
        }
    }), {
        "delay": 1,
        "iterationCount": 1,
        "fillMode": kony.anim.FILL_MODE_FORWARDS,
        "duration": 1
    }, {
        "animationEnd": TRANSFORM_ACTION_NEW____05f127fb1613425b9bd30cb1a12594a3_Callback
    });
    frmHome["flxMain"].animate(kony.ui.createAnimation({
        "100": {
            "stepConfig": {
                "timingFunction": kony.anim.EASE
            },
            "width": "100%",
            "height": "100%"
        }
    }), {
        "delay": 1,
        "iterationCount": 1,
        "fillMode": kony.anim.FILL_MODE_FORWARDS,
        "duration": 1.5
    }, {
        "animationEnd": SCALE_ACTION____dccf50ef33dc4993abf95b04ca70f5e4_Callback
    });
}