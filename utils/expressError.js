class ExpressError extends Error { //inheritance
    constructor(statusCode,message){
        super();  //inheritence 
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;