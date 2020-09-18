
let io = require('socket.io-client');
let fs = require('fs');
let ws = io('wss://ws-feed.zebpay.com/marketdata', { transports: ['websocket'] });

ws.on('connect', function () {
    console.log('Connected!');

    ws.on('close', function () {
        console.log('Closed!');
    });

    ws.on('error', (message) => {
        console.error('Error from socket server', message);
    });

    const channels = ["book_singapore", "history_singapore", "traderates", , "ticker_singapore"]; // 
    const trade_pairs = ["BTC-INR"] //, "BCH-INR", "ETH-INR", "LTC-INR", "XRP-INR", "EOS-INR", "BTC-EUR", "BCH-EUR", "ETH-EUR", "LTC-EUR", "XRP-EUR", "EOS-EUR"
    trade_pairs.forEach(pair => {
        channels.forEach(channel => {

            const event_name = channel + '/' + pair
            console.log('subscribe to ', event_name);
            ws.emit('subscribe', event_name), ws.on(event_name, (data) => {
                msg = Date.now() + ";" + event_name + ";" + JSON.stringify(data)
                console.log(msg);
                
                let s = Date.now().toString().substr(0,7)
                let file_name = 'zebpay_' + s + '.csv';

                fs.appendFile(file_name, msg + "\n", function (err) {
                    if (err) throw err;
                });
            });
        });
    });

});

