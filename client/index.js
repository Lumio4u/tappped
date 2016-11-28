
var socket = io()
var connected = true
var name = ''
var mytaps = 0
var taps = 0

function buy(item) {
    socket.emit('buy', item)
    console.log(item)
}

socket.on('shop-item', function(msg) {
    var escaped = ""
    for (key in msg) {
        item = msg[key]
        escaped+= '<input type="button" class="pure-button" onclick="buy(this)" value="' + item.name + ' ( ' + item.price + ' )' + '"/>'
    }
    if (escaped) {
        $("#shopItems").html(escaped).show();
    }
})

socket.on('disconnect', function() {
    connected = false
})

socket.on('lb', function(msg) {
    var escaped = ""
    for (key in msg) {
        var item = msg[key]
        escaped += "<div>" + (parseInt(key) + 1) + ".  " + item.name + "</div>";
    }
    $("#lb_detail").html(escaped);
})

socket.on('name', function(msg) {
    name = msg.name
    mytaps = msg.taps
    document.getElementById('UsrInfo').innerHTML = msg.txt + mytaps
})

socket.on('tap', function(msg) {
    var col = msg.color
    addPoint(msg.x, msg.y, col)
})

socket.on('mytap', function(msg) {
    var tag = msg.tag
    if (tag !== "" || tag) {
        achievement(tag, msg.col)
    }
    document.getElementById('nameID').innerHTML = msg.txt
})

socket.on('TxtMsg', function(msg) {
    sendMessage(msg)
})

socket.on('userCount', function(msg) {
    connected = true
    if (msg > 1) {
        usersP.innerHTML = msg + ' people are online'
    } else {
        usersP.innerHTML = msg + ' person is online'
    }

})

var ach = {
    width: 384,
    height: 384,
    y: -384,
    dy: -384,
    opacity: 0,
    txt: '',
    active: false
}

var achievement = function(txt, col) {
    ach.txt = txt
    ach.opacity = 1
    ach.y = -384
    ach.dy = 0
    ach.fillStyle = col
    ach.active = false

    window.setTimeout(function() {
        canvas.style.backgroundColor = ach.fillStyle + '1)'
    }, 500)

    var hex = rgb2hex(col + '1)')
    sendMessage(txt, 'rgba(255, 255, 255,', hex)
}

var sendMessage = function(txt, col, txt2) {
    var msg = {
        txt: txt,
        alive: false,
        opacity: 1,
        x: 0,
        y: -200
    }

    var submsg = {
        txt: txt2,
        alive: false,
        opacity: 1,
        x: 0,
        y: 400
    }

    if (!col) {
        msg.col = 'rgba(0,0,0,'
    } else {
        msg.col = col
    }

    if (!txt2) {} else {
        submessages[submessages.length] = submsg
        window.setTimeout(function() {
            submsg.alive = true
        }, 2500)
    }

    window.setTimeout(function() {
        msg.alive = true
    }, 2500)

    messages[messages.length] = msg
}

var canvas = document.getElementById('canv');
var usersP = document.getElementById('users');

var ctx = canvas.getContext('2d');
canvas.width = 384;
canvas.height = 384;

var px = 48;

var message = {
    x: 20,
    y: 40,
    font: '21px Oswald',
    opacity: 1,
    txt: 'Tap Anywhere!'
};

var submessage = {
    x: 20,
    y: 364,
    font: '21px Oswald',
    opacity: 1,
    txt: 'Tap Anywhere!'
};

var points = [];
var touches = [];
var messages = [];
var submessages = [];

window.onload = function() {

    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;


    window.setInterval(function() {
        update();
        draw();
    }, 1000 / 60);
};

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, false);

document.addEventListener('touchstart', function(e) {
    var touchList = e.changedTouches;

    var rect = canvas.getBoundingClientRect();
    var xx = touchList[touchList.length - 1].screenX - rect.left;
    var yy = touchList[touchList.length - 1].screenY - rect.top;

    var col = generateColor();

    var pkg = {
        x: xx,
        y: yy,
        color: col
    };
    socket.emit('tap', pkg);

    addPoint(xx, yy, col);

}, false);

document.addEventListener('mousedown', function(e) {
    if (!connected) {
        sendMessage('You are currently not connected! :c');
    }

    var rect = canvas.getBoundingClientRect();
    var xx = e.clientX - rect.left;
    var yy = e.clientY - rect.top;

    var col = generateColor();

    var pkg = {
        x: xx,
        y: yy,
        color: col
    };

    socket.emit('tap', pkg);

    addPoint(xx, yy, col);

}, false);

var update = function() {

    for (var i = 0; i < points.length; i++) {
        if (points[i].opacity > 0) {
            points[i].opacity -= 0.02;
            points[i].radius += 10;
        }

        if (points[i].opacity < 0) {
            points[i].opacity = 0;
            points[i].alive = false;
        }
    }

    for (var i = 0; i < messages.length; i++) {

        if (messages[i].y !== 0 && !messages[i].alive) {
            messages[i].y = messages[i].y + (0 - messages[i].y) / 8;
        }

        if (messages[i].alive == true && messages[i].x == 0) {

            messages[i].y -= 2;

            if (messages[i].opacity > 0) {
                messages[i].opacity -= 0.02;
            }
        }
    }

    for (var i = 0; i < submessages.length; i++) {

        if (submessages[i].y !== 0 && !submessages[i].alive) {
            submessages[i].y = submessages[i].y + (0 - submessages[i].y) / 8;
        }

        if (submessages[i].alive == true && submessages[i].x == 0) {

            submessages[i].y += 2;

            if (submessages[i].opacity > 0) {
                submessages[i].opacity -= 0.02;
            }
        }
    }


};

var addPoint = function(dx, dy, color) {

    var point = {
        x: dx,
        y: dy,
        radius: 30,
        opacity: 1,
        fillStyle: color,
        alive: true
    };
    points[points.length] = point;
};

var draw = function() {

    ctx.clearRect(0, 0, px * 8, px * 8);

    if (ach.y !== ach.dy) {
        ach.y = ach.y + (ach.dy - ach.y) / 8;
    }

    if (ach.opacity > 0) {

        ach.opacity -= 0.005;
    } else {

        ach.opacity = 0;
        ach.dy = 800;
        ach.y = 800;
    }

    ctx.fillStyle = ach.fillStyle + ach.opacity + ')';
    ctx.fillRect(0, ach.y, 384, 384);

    for (var i = 0; i < points.length; i++) {

        if (points[i].alive == true) {
            ctx.fillStyle = points[i].fillStyle + points[i].opacity + ')';
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, points[i].radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    if (messages.length > 0) {

        var i = messages.length - 1

        if (messages.length < 0) {
            i = messages.length
        };

        if (messages[i].opacity > 0) {
            ctx.fillStyle = messages[i].col + messages[i].opacity + ')';
            ctx.textAlign = 'center';
            ctx.font = '21px Helvetica';
            ctx.fillText(messages[i].txt, canvas.width / 2, message.y + messages[i].y);
        };
    };

    if (submessages.length > 0) {

        var i = submessages.length - 1

        if (submessages.length < 0) {
            i = submessages.length
        };

        if (submessages[i].opacity > 0) {
            ctx.fillStyle = submessages[i].col + submessages[i].opacity + ')';
            ctx.textAlign = 'center';
            ctx.font = '21px Helvetica';
            ctx.fillText(submessages[i].txt, canvas.width / 2, submessage.y + submessages[i].y);
        };
    };
};

var generateColor = function() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    return 'rgba(' + r + ',' + g + ',' + b + ',';
};

var rgb2hex = function(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}