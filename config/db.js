if(process.env.NODE_ENV == "production"){
    /*
        DATA-BASE (PROD)
    */
    module.exports = {mongoURI: "string de conexão do mongoDB PROD"}
}else{
    /*
        DATA-BASE (DEV)
    */
    module.exports = {mongoURI: "string de conexão do mongoDB DEV "}
}