const authController ={
    register: (req, res)=>{
        res.send("register");
    },
    login: (req, res) =>{
        res.send("login");
    },
}

module.exports =authController;