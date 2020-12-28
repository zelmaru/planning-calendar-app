require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const date = require("./date");
const mongoose = require("mongoose");

const today = date.getDate(); // get today's date from date module
const app = express();

app.set("view engine", "ejs");

// set body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_CREDENTIALS}@cluster0.vfnca.mongodb.net/todoDB`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.set("useFindAndModify", false);

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

let items = [];

const daySchema = {
  name: String,
  items: [itemSchema],
};

const Day = mongoose.model("Day", daySchema);

// display todays list when going to home page as default
app.get("/", (req, res) => {
  // requested todays list route
  res.redirect("/date/" + today);
});

// handle the request
app.get("/date/:requestedDate", (req, res) => {
  const requestedDate = req.params.requestedDate;

  // search for the requested date in DB
  Day.findOne({ name: requestedDate }, (err, foundDate) => {
    // foundDate is an object, so we cannot check its length: check if it exists or not instead
    if (!err) {
      if (!foundDate) {
        //if date does not exist yet, create a new date
        const day = new Day({
          name: requestedDate,
          items: items,
        });

        day.save();
        // redirect to the requested date URL
        res.redirect("/date/" + requestedDate);
      } else {
        // render existing list
        res.render("list", {
          listTitle: foundDate.name,
          newListItems: foundDate.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  // what happens when you pick a new date in datepicker:
  const clickedDate = req.body.datepicker;
  // search for the picked date in DB
  Day.findOne({ name: clickedDate }, (err, foundDate) => {
    if (!err) {
      if (!foundDate) {
        //if a date does not exist yet, create a new date list
        const day = new Day({
          name: clickedDate,
          items: items,
        });

        day.save();
        // redirect to the requested date URL
        res.redirect("/date/" + clickedDate);
      } else {
        // show an existing list:  redirect to the requested date URL => renders
        res.redirect("/date/" + clickedDate);
      }
    }
  });
});

// adding new items:

app.post("/add", (req, res) => {
  const dateToPostTo = req.body.getDayToAddItemTo;
  const itemAdded = req.body.newItem; // store input in a variable
  const item = new Item({
    name: itemAdded,
  });

  Day.findOne({ name: dateToPostTo }, (err, foundDay) => {
    if (!err) {
      foundDay.items.push(item);
      foundDay.save();
      res.redirect("/date/" + foundDay.name);
    }
  });
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.delete;
  const DateToDeleteFrom = req.body.DateToDeleteFrom;

  Day.findOneAndUpdate(
    { name: DateToDeleteFrom },
    { $pull: { items: { _id: checkedItemId } } },
    (err, foundDate) => {
      // findOne corresponds to finding a list (therefore findList)
      if (!err) {
        res.redirect("/date/" + DateToDeleteFrom);
      }
    }
  );
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`ToDoList running on port ${port}`);
});
