import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import indexRouter from "./src/routes/indexRouter.js";
import { connectToMongo } from "./src/models/conn.js";

async function main() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();

    app.use("/static", express.static(__dirname + "/public"));
    app.use(express.static('./public'));

    app.engine('hbs', exphbs.engine({extname: 'hbs'}));
    app.set("view engine", "hbs");
    app.set("views", "./views");
    app.set("view cache", false);

// ===============================================================================================
// Cookies and Session, still figuring them out and looking at old code from apdev
    app.use(express.json());
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    }));

    app.use((req, res, next) => {
        res.locals.session = req.session;
        next();
    });

    // EXPERIMENTAL - 
    app.use((req, res, next) => {
        console.log('Session ID:', req.sessionID);
        next();
    })


// ===============================================================================================
    app.use(indexRouter);

    console.log("Running on port: " + process.env.SERVER_PORT);
    
    try {
        await connectToMongo();
        console.log("Connected to " + process.env.MONGODB_URI);
        console.log("Database name is: " + process.env.DB_NAME);
        
        app.listen(process.env.SERVER_PORT, () => {
            console.log("Express app now listening...");
        });
    } catch (err) {
        console.error(err);
        console.log("Failed to connect to database");
        process.exit(1);
    }
}

main();