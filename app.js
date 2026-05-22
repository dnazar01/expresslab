const LOGIN = 'dnazar01';

export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
    const app = express();

    const sendLogin = (req, res) => {
        res.type('text/plain').send(LOGIN);
    };

    const proxyRequest = (addr, res) => {
        http.get(addr, (response) => {
            let result = '';

            response.setEncoding('utf8');

            response.on('data', (chunk) => {
                result += chunk;
            });

            response.on('end', () => {
                res.type('text/plain').send(result);
            });
        });
    };

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Content-Type, x-author, ngrok-skip-browser-warning',
        };

        Object.entries(headers).forEach(([name, value]) => {
            res.set(name, value);
        });

        next();
    });

    app.get('/login/', sendLogin);

    app.get('/code/', (req, res) => {
        res.type('text/plain');
        createReadStream(new URL(import.meta.url)).pipe(res);
    });

    app.get('/sha1/:input/', (req, res) => {
        const hash = crypto
            .createHash('sha1')
            .update(req.params.input)
            .digest('hex');

        res.type('text/plain').send(hash);
    });

    app.get('/req/', (req, res) => {
        proxyRequest(req.query.addr, res);
    });

    app.post('/req/', (req, res) => {
        proxyRequest(req.body?.addr || req.query?.addr, res);
    });

    app.all(/.*/, sendLogin);

    return app;
}
