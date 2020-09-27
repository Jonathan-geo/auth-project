const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const admin = require('./routes/admin');
const usuarios = require('./routes/usuario');

const db = require('./config/db');


require("./models/Postagem");
const Postagem = mongoose.model("postagens");

const passport = require("passport");
require("./config/auth")(passport);



//---INICIANDO O APP----//
const app = express();



//---CONFIGURAÇÂO SESSION----//
app.use(session({
    secret: "sessionkey",
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize())
app.use(passport.session())





app.use(flash());

        //---MIDDLEWERE SESSION----//
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})


//---CONFIGURAÇÂO BODY-PARSER----//
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

//---CONFIGURAÇÂO PASTA-PUBLIC----//
app.use(express.static(__dirname+'/public'));


//---CONFIGURAÇÂO HANDLEBARS----//
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');


//---CONFIGURAÇÂO MONGOOSE-MONGODB----//
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
    }).then(()=>{
        console.log("MongoDB Conectado...")
    }).catch((err) =>{
        console.log("Houve um erro ao se conectar ao mongoDB: " + err)
    })



//---EXEMPLO DE MIDDLEWERE---//
/*
Este midlewere interserpta toda a requisição feita em meu site
e o next() é usado para que o meu site não fique parado neste 
middlewere. 

app.use((req, res, next)=>{

    console.log('Oi eu sou um midlewere!')
    //NODE_ENV="production"
    console.log(process.env.NODE_ENV);

    next();

})

*/


//---CONFIGURAÇÂO ROTAS----//
app.use('/admin', admin)
app.use('/usuarios', usuarios)



/*
---------------------GET
---------------------index
---------------------/
*/
app.get('/', (req, res)=>{
    /*
        populate("categoria") usa-se categoria pois é a "variavel" no meu model
        que referencia a tabela Categorias. 
    */
   Postagem.find().populate("categoria").sort({date:'desc'}).lean()
        .then((getPostagens)=>{
            //console.log(getPostagens);

            //res.render()
            res.render("index", {postagem: getPostagens})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro Interno");
            res.redirect("/404")
        })  
        
})


app.get('/404', (req, res)=>{
    res.render("erro404");
})



app.get('/postagens/:slug', (req, res)=>{
   Postagem.findOne({slug: req.params.slug}).lean()
        .then((getPostagens)=>{
            //console.log(getPostagens)

            res.render("postagem/index", {postagem: getPostagens}) 
        })
        .catch((err)=>{
            console.log(err)
            req.flash("error_msg", "Houve um erro Interno");
            res.redirect("/")
        })  
        
})



//---STARTAR SERVIDOR----//
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`auth-project listening on ${port}`);
})