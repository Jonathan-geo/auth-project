if(process.env.NODE_ENV == "production"){
    /*
        DATA-BASE (PROD)
    */
    module.exports = {mongoURI: "mongodb+srv://jonathan:1246583dv7@cluster0.5ueib.mongodb.net/auth-project?retryWrites=true&w=majority"}
}else{
    /*
        DATA-BASE (DEV)
    */
    module.exports = {mongoURI: "mongodb+srv://jonathan:1246583dv7@cluster0.5ueib.mongodb.net/auth-project?retryWrites=true&w=majority"}
}