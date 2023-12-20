const express =require("express")
const bodyParser = require("body-parser");
const app =express()
const fs =require("fs")
const cors = require("cors");
const user=require("../Backend/utils/db.js")
const { uid } = require('uid');

app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log('Url:',req.method, req.url, Date.now())
    next()
  })
app.get("/",(req,res)=>{
    console.log("entered:",req.url)
    res.send("hello World")
})
app.post("/signin",(req,res)=>{
    // console.log(req.body)

    const newUser = Object.assign({ id:uid()}, req.body);
    const foundUser = user.find(u => u.email === newUser.email);
    if (!foundUser) {
        const updatedUser=user.push(newUser)
        console.log(updatedUser)
        fs.writeFileSync("../Backend/utils/db.js",`module.exports=${JSON.stringify(user)}`)

        res.json([{email:req.body.email,id:newUser.id,first_name:req.body.first_name,last_name:req.body.last_name,auth:{login:true,status:"signIn"}}])
    }else{
        res.status(403).send("User Already Exist")
      }
})
app.post("/login",(req,res)=>{
    let loginEmail=user.find(e=> e.email===req.body.email && e.password===req.body.password
        )
        if (loginEmail){
            const response = {
        email: loginEmail.email,
        id: loginEmail.id,
        first_name: loginEmail.first_name,
        last_name: loginEmail.last_name,
        auth: {
            login: true,
            status: "login"
        }
    };
    res.json([response]);
            }
            else{
                res.status(401).send("Invalid Email or Password")
                }
})
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})