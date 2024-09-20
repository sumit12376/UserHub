const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/read', async (req, res) => {
    let users = await userModel.find()
    res.render('read', { users });
});
app.get('/delete/:id', async (req, res) => {
    let users = await userModel.findOneAndDelete({ _id: req.params.id })
    res.redirect("/read");
});
app.get('/edit/:userid', async (req, res) => {
    let users = await userModel.findOne({ _id: req.params.userid })
    res.render("edit", { users });
});
app.post('/update/:userid', async (req, res) => {
    let { name, Image, email } = req.body;
    let users=await userModel.findOneAndUpdate({_id:req.params.userid},{ name, Image, email },{new:true})
    res.redirect("/read")
})

app.post('/create', async (req, res) => {
    let { name, Image, email } = req.body;
    try {
        let user = await userModel.create({
            name: name,
            email: email,
            image: Image
        });
        res.redirect("/read");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

mongoose.connect('mongodb://127.0.0.1/testapp1', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
