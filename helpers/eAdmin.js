module.exports = {
    /*
    //BLOQUEIA QUALQUER PESSOA NÂO LOGADA
    eAdmin: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg", "Voce deve estar logado para entrar aqui!")
        res.redirect("/")
    }
    */

    //BLOQUEIA PESSOA QUE NÂO É ADMIN
    eAdmin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }
        req.flash("error_msg", "Voce deve estar logado como admin para entrar na Área do Admin!")
        res.redirect("/usuarios/login")
    }

}