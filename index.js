var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT || 5000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB
mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.gijbx.mongodb.net/myDatabase?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
)
.then(() => console.log("MongoDB connection successful"))
.catch((err) => console.error("MongoDB connection error:", err));

// Store the connection in a variable
var db = mongoose.connection;

db.on('error', () => console.log("Error in connecting to the Database"));
db.once('open', () => {
    console.log("Connected to Database");

    // Post request for adding data
    app.post("/add", (req, res) => {
        var category_select = req.body.category_select;
        var amount_input = req.body.amount_input;
        var info = req.body.info;
        var date_input = req.body.date_input;

        var data = {
            "Category": category_select,
            "Amount": amount_input,
            "Info": info,
            "Date": date_input
        };

        db.collection('users').insertOne(data, (err, collection) => {
            if (err) {
                throw err;
            }
            console.log("Record Inserted Successfully");

            // End the response with a status code but no content
            res.status(204).end();  // 204 No Content
        });
    });

    // Get request for serving the homepage
    app.get("/", (req, res) => {
        res.set({
            "Allow-access-Allow-Origin": '*'
        });
        return res.redirect('index.html');
    });

    // Start the server only after connecting to the database
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
