const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const passport = require("passport")

require("../models/Usuario");
const Usuario = mongoose.model("usuarios")



/*
---------------------GET
---------------------registro
---------------------usuarios/registro
*/
router.get('/registro', (req, res)=>{

    res.render("usuarios/registro")

})



/*
---------------------POST
---------------------registro
---------------------/
*/
router.post('/registro', (req, res)=>{

    let errosList = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errosList.push({texto: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errosList.push({texto: "Email inválido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        errosList.push({texto: "Senha1 inválido"})
    }

    if(!req.body.senha2 || typeof req.body.senha2 == undefined || req.body.senha2 == null){
        errosList.push({texto: "Senha2 inválido"})
    }

    if(req.body.senha.length < 4){
        errosList.push({texto: "A senha deve ter mais de 4 caracteres"})
    }

    if(req.body.senha != req.body.senha2){
        errosList.push({texto: "A senha 1 deve ser igual a senha 2"})
    }


    if(errosList.length > 0){
        res.render("usuarios/registro", {erros: errosList})
    }else{

            /*
                Verificar se o usuário já é cadastrado:
            */
        Usuario.findOne({email : req.body.email}).lean()
           .then((getUsuario)=>{

                if(getUsuario){

                    req.flash("error_msg", "Email já cadastrado!");
                    res.redirect('/usuarios/registro');

                }else{

                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha
                    })

                    bcrypt.genSalt(10, (erro, salt) => { 
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                            if(erro){
                                req.flash("error_msg", "Houve um erro ao criptografar sua senha!");
                                res.redirect('/usuarios/resgistro');
                            }else{

                                novoUsuario.senha = hash;

                                novoUsuario.save().then(()=>{
                                    req.flash("success_msg", "Usuario cadastrado com sucesso!");
                                    res.redirect('/');
                                }).catch((err) => {
                                    req.flash("error_msg", "Houve um erro interno, tente novamente ou contate o administrador!");
                                    res.redirect('/usuarios/registro');
                                });

                            }
                        })
                    })

                }
    
           }).catch((err) => {
               req.flash("error_msg", "Houve um erro interno, contate o administrador!");
               res.redirect('/usuarios/registro');
           });

    }

})




/*
---------------------GET
---------------------registro
---------------------usuarios/registro
*/
router.get('/login', (req, res)=>{

    res.render("usuarios/login")

})



router.post('/login', (req, res, next)=>{

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login" ,
        failureFlash: true
    })(req, res, next)
    req.flash("success_msg", "Login executado com sucesso!");
})


router.get('/logout', (req, res)=>{
    req.logout();
    req.flash("success_msg", "Logout executado com sucesso!");
    res.redirect('/usuarios/login');
})


module.exports = router;