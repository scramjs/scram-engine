class ScramHttpServerComponent {
    public is;
    public properties;

    public port;

    beforeRegister() {
        this.is = 'scram-http-server';
        this.properties = {
            port: {
                type: Number
            }
        };
    }

    ready() {
        const express = require('express');
        const app = express();
        const port = this.port;

        app.get('/', (req, res) => {
            res.send('It works!');
        });

        app.listen(port, () => {
            console.log(`app listening on port: ${port}`);
        });
    }

    attached() {}
    detached() {}
    attributeChanged() {}
}

Polymer(ScramHttpServerComponent);
