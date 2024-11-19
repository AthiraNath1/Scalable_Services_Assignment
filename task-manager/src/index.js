const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const mongoose = require('mongoose');
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Database connection error:', err));
const stockdataSchema = new mongoose.Schema({
    name: String,
    currentPrice: Number,
    initialPrice:Number,
    percentChange:Number,
    volume:Number,
    turnOver:Number
});

// Create a model
const stockData = mongoose.model('stockData', stockdataSchema);

//create stock
app.post("/addStock", (req, res) => {
    const stockdata = new stockData(req.body);
    stockdata.save().then(()=>{
res.send(stockdata)
    }).catch((e)=>{
        console.log('error',e)
    })
});

//get stock
app.get("/getStockData", (req, res) => {
    stockData.find({})
        .then(data => res.json(data))
        .catch(error => {
            console.error('Error fetching users:', error);
            res.status(500).send('Error fetching users');
        });
});

//get specific stock by name
app.get('/getStockData/:name', async (req, res) => {
    try {
        const stockDataName = await stockData.findOne({ name: req.params.name });
        if (!stockDataName) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(stockDataName);
    } catch (error) {
        res.status(500).send('Error retrieving user data');
    }
});

// DELETE route to delete a stock by name
app.delete("/stockData/:name", (req, res) => {
    const stockDataName = req.params.name;

    stockData.findOneAndDelete({ name: stockDataName })
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).send({ message: "User not found" });
            }
            res.send({ message: `Stock ${stockDataName} deleted`, user: stockDataName });
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        });
});

//Update
app.put("/updateStock/:name", (req, res) => {
    const stockDataName = req.params.name;
    const updates = req.body; 

    stockData.findOneAndUpdate({ name: stockDataName }, updates, { new: true, runValidators: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.send(`User updated: ${JSON.stringify(updatedUser)}`);
            } else {
                res.status(404).send(`No user found with the name "${stockDataName}".`);
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            res.status(500).send('Error updating user');
        });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});



