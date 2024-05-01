const whitelist = [
    'https://dazzling-snickerdoodle-777101.netlify.app/'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(null, true);
        }
    },
    optionsSuccessStatus: 200
}