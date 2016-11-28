function rewards() {}

module.exports = rewards;

rewards.prototype.getReward = function (taps) {
    var out = "";
    switch (taps) {
        case 10:
            out = 'Big Ten'
            break;
        case 25:
            out = 'Five x Five'
            break;
        case 50:
            out = 'Get Rich or Die Trying'
            break;
        case 80:
            out = 'The Good ol\' Eighties'
            break;
        case 100:
            out = "Keepin' it One Hunnid"
            break;
        case 300:
            out = 'This is Sparta'
            break;
        case 314:
            out = '3.14159265359'
            break;
        case 500:
            out = 'Franklin Five'
            break;
        case 750:
            out = 'Almost Cool'
            break;
        case 1000:
            out = 'Get a Life'
            break;
    };
    return out;
}