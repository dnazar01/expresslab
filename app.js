const LOGIN = 'dnazar01';

export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
        next();
    });

    app.get('/login/', (req, res) => {
        res.type('text/plain').send(LOGIN);
    });

    app.get('/code/', (req, res) => {
        res.type('text/plain');
        createReadStream(import.meta.url.substring(7)).pipe(res);
    });

    app.get('/sha1/:input/', (req, res) => {
        res.type('text/plain').send(
            crypto.createHash('sha1').update(req.params.input).digest('hex')
        );
    });

    app.get('/req/', (req, res) => {
        http.get(req.query.addr, response => {
            let data = '';

            response.setEncoding('utf8');

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                res.type('text/plain').send(data);
            });
        });
    });

    app.post('/req/', (req, res) => {
        http.get(req.body.addr || req.query.addr, response => {
            let data = '';

            response.setEncoding('utf8');

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                res.type('text/plain').send(data);
            });
        });
    });

    app.all(/.*/, (req, res) => {
        res.type('text/plain').send(LOGIN);
    });

    return app;
}
