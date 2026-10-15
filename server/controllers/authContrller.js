const authController ={
    register: (req, res)=>{
        
        console.log(req.body);

        res.send("register");
    },
    login: (req, res) =>{
        res.send("login");
    },
}

module.exports =authController;