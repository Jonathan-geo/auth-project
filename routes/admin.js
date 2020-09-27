const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require("../models/Categoria");
const Categoria = mongoose.model("categorias")

require("../models/Postagem");
const Postagem = mongoose.model("postagens")



const {eAdmin} = require('../helpers/eAdmin');



/*
---------------------GET
---------------------categorias
---------------------/categorias
*/
router.get('/categorias', eAdmin, (req, res)=>{
    Categoria.find().sort({date:'desc'}).lean().then((getCategorias)=>{
        
        //console.log(getCategorias);

        //res.render("admin/categorias", {getCategoria:getCategorias.map(category => category.toJSON())})

        res.render("admin/categorias", {getCategoria:getCategorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao Listar as Categorias");
        res.redirect("/")
    })    
})



/*
---------------------GET
---------------------addcategorias
---------------------/categorias/add
*/
router.get('/categorias/add', eAdmin, (req, res)=>{
    res.render("admin/addcategorias")
})


/*
---------------------POST
---------------------/categorias/nova
*/
router.post('/categorias/nova', eAdmin, (req, res)=>{

    let errosList = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errosList.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errosList.push({texto: "Slug inválido"})
    }

    if(req.body.nome.length < 2 && req.body.nome.length > 0){
        errosList.push({texto: "O nome precisa ter mais de 2 caracteres"})
    }

    if(req.body.slug.length < 2 && req.body.slug.length > 0){
        errosList.push({texto: "O slug precisa ter mais de 2 caracteres"})
    }

    if(errosList.length > 0){
        res.render("admin/addcategorias", {erros: errosList})
    }else{

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        //console.log(novaCategoria);
        
        new Categoria(novaCategoria).save()
            .then(()=>{
                req.flash("success_msg", "Categoria Criada com Sucesso!")
                res.redirect("/admin/categorias")
            })
            .catch((err)=>{
                req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
                res.redirect("/")
            })


    }

})



/*
---------------------GET
---------------------editCategoria
---------------------/categorias/edit/:id
*/
router.get('/categorias/edit/:id', eAdmin, (req, res)=>{

    //console.log('req.params.id');
    //console.log(req.params.id);

    Categoria.findOne({_id : req.params.id}).lean()
        .then((categoriaParams)=>{
            res.render("admin/editCategoria", {categoria: categoriaParams});
        }).catch((err) => {
            req.flash("error_msg", "Esta categoria não existe!");
            res.redirect('/admin/categorias');
        });
    
});


/*
---------------------POST
---------------------/categorias/edit
*/
router.post('/categorias/edit', eAdmin, (req, res)=>{

    //console.log('req.body.nome')
    //console.log(req.body.nome)

    //console.log('req.body.nome.length')
    //console.log(req.body.nome.length)

    let errosList = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        errosList.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errosList.push({texto: "Slug inválido"})
    }
    
    if(req.body.nome.length < 3 && req.body.nome.length > 0){
        errosList.push({texto: "O nome precisa ter mais de 2 caracteres"})
    }

    if(req.body.slug.length < 3 && req.body.slug.length > 0){
        errosList.push({texto: "O slug precisa ter mais de 2 caracteres"})
    }
    
    if(errosList.length > 0){
        res.render("admin/index", {erros: errosList})
    }else{

        const editCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }


        Categoria.findOne({_id : req.body.id})
        .then((categoriaParams)=>{

            categoriaParams.nome = editCategoria.nome
            categoriaParams.slug = editCategoria.slug

            categoriaParams.save().then(()=>{
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edicação da categoria!")
                res.redirect("/")
            })

        }).catch((err) => {
            req.flash("error_msg", "Esta categoria não existe!");
            res.redirect('/');
        });


    }

    
});


/*
---------------------POST/DELETE
---------------------/categorias/edit/:id
*/
router.post('/categorias/deletar', eAdmin, (req, res)=>{

    Categoria.remove({_id : req.body.id})
        .then(()=>{
            req.flash("success_msg", "Categoria deletada com sucesso!")
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar a categoria");
            res.redirect('/categorias');
        });
    
});






















/*
---------------------GET
---------------------postagens
---------------------/postagens
*/
router.get('/postagens', eAdmin, (req, res)=>{

    /*
        populate("categoria") usa-se categoria pois é a "variavel" no meu model
        que referencia a tabela Categorias. 
    */
   
    Postagem.find().populate("categoria").sort({date:'desc'}).lean().then((getPostagens)=>{
        
        //console.log(getPostagens);

        res.render("admin/postagens", {postagem: getPostagens})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao Listar as Postagens");
        res.redirect("/")
    })  

});



/*
---------------------GET
---------------------postagens
---------------------/postagens
*/
router.get('/postagens/add', eAdmin, (req, res)=>{

    /*
    Esta busca no model categoria é necessária para buscar o ID 
    de categorias para referenciar meu campo de categorias no 
    formulário de postagens
    */

    Categoria.find().lean()
    .then((categorias)=>{
        res.render("admin/addPostagens", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar as categorias")
    })

});

/*
---------------------POST
---------------------/postagens/nova
*/
router.post('/postagens/nova', eAdmin, (req, res)=>{

    let errosList = [];

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        errosList.push({texto: "titulo inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errosList.push({texto: "Slug inválido"})
    }

    if(req.body.titulo.length < 2 && req.body.titulo.length > 0){
        errosList.push({texto: "O titulo precisa ter mais de 2 caracteres"})
    }

    if(req.body.slug.length < 2 && req.body.slug.length > 0){
        errosList.push({texto: "O slug precisa ter mais de 2 caracteres"})
    }

    if(req.body.categoria == 0){
        errosList.push({texto: "É necessário ter uma categoria para cadastrar um post!"})
    }

    if(errosList.length > 0){
        res.render("admin/addPostagens", {erros: errosList})
    }else{

        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }
    
        //console.log(novaPostagem);
        
        new Postagem(novaPostagem).save()
            .then(()=>{
                req.flash("success_msg", "Postagem Criada com Sucesso!")
                res.redirect("/admin/postagens")
            })
            .catch((err)=>{
                req.flash("error_msg", "Houve um erro ao salvar a postagem, tente novamente!")
                res.redirect("/")
            })
    
        
       //res.redirect("/postagens/add")
    }

})


/*
---------------------GET
---------------------editPostagens
---------------------/postagens/edit/:id
*/
router.get('/postagens/edit/:id', eAdmin, (req, res)=>{

    //console.log('req.params.id');
    //console.log(req.params.id);

    Postagem.findOne({_id : req.params.id}).populate("categoria").lean()
        .then((postagensParams)=>{

            Categoria.find().lean()
            .then((categoriasParams)=>{
                res.render("admin/editPostagens", {categoria: categoriasParams, postagem: postagensParams});
            }).catch((err)=>{
                req.flash("error_msg", "Houve um erro ao carregar as categorias")
                res.redirect('/admin/postagens');
            })

        }).catch((err) => {
            req.flash("error_msg", "Esta categoria não existe!");
            res.redirect('/admin/postagens');
        });
    
});



/*
---------------------POST
---------------------/postagens/edit
*/
router.post('/postagens/edit', eAdmin, (req, res)=>{

    //console.log('req.body.nome')
    //console.log(req.body.nome)

    //console.log('req.body.nome.length')
    //console.log(req.body.nome.length)

    let errosList = [];

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        errosList.push({texto: "titulo inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        errosList.push({texto: "Slug inválido"})
    }

    if(req.body.titulo.length < 2 && req.body.titulo.length > 0){
        errosList.push({texto: "O titulo precisa ter mais de 2 caracteres"})
    }

    if(req.body.slug.length < 2 && req.body.slug.length > 0){
        errosList.push({texto: "O slug precisa ter mais de 2 caracteres"})
    }

    if(req.body.categoria == 0){
        errosList.push({texto: "É necessário ter uma categoria para cadastrar um post!"})
    }
    
    if(errosList.length > 0){
        res.render("admin/index", {erros: errosList})
    }else{

        let editPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        }


        Postagem.findOne({_id : req.body.id})
        .then((postagemParams)=>{

            postagemParams.titulo = editPostagem.titulo
            postagemParams.slug = editPostagem.slug
            postagemParams.descricao = editPostagem.descricao
            postagemParams.conteudo = editPostagem.conteudo
            postagemParams.categoria = editPostagem.categoria


            postagemParams.save().then(()=>{
                req.flash("success_msg", "Postagem editada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edicação da postagem!")
                res.redirect("/")
            })

        }).catch((err) => {
            req.flash("error_msg", "Esta postagem não existe!");
            res.redirect('/');
        });


    }

    
});


/*
---------------------POST/DELETE
---------------------/categorias/edit/:id
*/
router.post('/postagens/deletar', eAdmin, (req, res)=>{

    Postagem.remove({_id : req.body.id})
        .then(()=>{
            req.flash("success_msg", "Categoria deletada com sucesso!")
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao deletar a categoria");
            res.redirect('/admin/postagens');
        });
    
});



module.exports = router;