const net = require('net');
const fab = require('./fabric')
const fs = require('fs');


const server = net.createServer(function (socket) {
    socket.write('Echo server\r\n');
    // console.log(socket)
    socket.pipe(socket);
    let json = ''
    let arr = []
    // socket.setEncoding('utf8');
    // let x = socket.read(10000)
    // console.log(x)
    socket.on('data', (data) => {
        json += data
        try {
            let payload = JSON.parse(json.toString())
            console.log(payload)
            if (payload.command === "print") {
                console.log("value: ", JSON.stringify(payload.value))
                arr.push(JSON.stringify(payload.value))

                print()
            }
        } catch (e) {
            console.log(e)
        }
        async function print () {

            for(let obj of arr) {

                try {
                    await  printLabel(obj, socket).then(data => console.log('print')).catch(() => this.json='')
                } catch (e) {
                    console.log('Print error')
                    json=''
                }
            }
        }
        // {"command": "print", "value":{"version":"3.6.3","objects":[{"type":"i-text","version":"3.6.3","originX":"left","originY":"top","left":10,"top":10,"width":44.49,"height":45.2,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"ee","fontSize":40,"fontWeight":"","fontFamily":"arial","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"left","textBackgroundColor":"","charSpacing":0,"styles":{},"id":511111}]}}

        // try {
        //     printLabel(data.toString(),socket).then(data => console.log(data)).catch(() => json='')
        // } catch (e) {
        //     console.log('Print error')
        // }
        // var bread = socket.bytesRead;
        // var bwrite = socket.bytesWritten;
        // var newdata = ""+data;
        // var newdatachunks = newdata.split("\n");
        //
        // for (var i = 0 ; i<(newdatachunks.length-1);i++) {
        //     console.log("real data is :"+newdatachunks[i]);
        // }
        // console.log('Bytes read : ' + bread);
        // console.log('Bytes written : ' + bwrite);
        // console.log('Data sent to server : ' + json);

        // json += chunk
        // console.log(json)
        // var is_kernel_buffer_full = socket.write('Data ::' + data);
        // if(is_kernel_buffer_full){
        //     console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
        // }else{
        //     socket.pause();
        // }
    })

    socket.on('error', (e) => {
        console.log(e)
    })

    socket.on('end', (e) => {
        console.log('enddddd')
        // console.log(json)
        // async function print () {
        //
        //     for(let obj of arr) {
        //
        //         try {
        //           await  printLabel(obj, socket).then(data => console.log(data)).catch(() => this.json='')
        //         } catch (e) {
        //             console.log('Print error')
        //             json=''
        //         }
        //     }
        // }
        // print()
    })
});

server.listen(28808, '0.0.0.0');



// let x = JSON.stringify(data1)
async function printLabel(json, socket) {
    return new Promise((resolve,reject) => {


    fab(json)
        .then((res) => {


            // console.log(res)
            const regex = /^data:.+\/(.+);base64,(.*)$/;
            const string = res;
            const matches = string.match(regex);
            // console.log(matches)
            const ext = matches[1];
            const data = matches[2];
            // console.log(matches)
            const buffer = Buffer.from(data, 'base64');
            fs.writeFileSync('plikA.' + ext, buffer);
            const base64str = base64_encode('./plikA.png');
            // console.log(base64str);
            const zplToSend = "^XA" + "^MNA" + "^LL0480" + "~DYE:LABEL,P,P," + (base64str.length / 2) + ",," + base64str + "^XZ";
            // console.log(base64str.length)
            fs.writeFile('/dev/usb/lp1', zplToSend, function (err, dat) {
                if (err) {
                    return console.log('kit',err);
                }
                // console.log(dat);
                fs.writeFile('/dev/usb/lp1', '^XA\n' +
                    '^MMT\n' +
                    '^PW639\n' +
                    '^LL0480\n' +
                    '^LS0\n' +
                    '^XGE:LABEL.PNG,1,1^FS\n' +
                    '^PQ1,0,1,Y^XZ', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    // socket.write('oko')
                    //resolve('Print')

                })
            })

        }).then(data => 'kartofle')
        .catch(err => console.log('err'))
    })
}

function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('hex');
}
