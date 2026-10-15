const app=require("./app");
//set the port to listen on
const PORT=process.env.PORT||5001;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
