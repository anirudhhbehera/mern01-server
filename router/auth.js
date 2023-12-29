const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const cookieParser = require("cookie-parser")
router.use(cookieParser());

require('../db/conn');
const User =require("../model/userSchema"); 

router.get('/', (req, res) => {
    res.send(`Hello world from the server router js`);
});


//By promises
// router.post('/register', (req, res) => {

//     const  { name,email,phone,work,password,cpassword}=req.body;
//     // console.log(req.body);
//     // res.json({ message: req.body });
//     if( !name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"All field are required"});
//     }

//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"Email already exist 1205"});
//         }
//         const user = new User({name,email,phone,work,password,cpassword});

//         user.save().then(()=>{
//             res.status(201).json({message:"user registered successfully"});
//         }).catch((err)=> res.status(500).json({error:"failed to register"}));

//     }).catch(err =>{console.log(err);})
// });

//By async
router.post('/register', async (req, res) => {
    try {
      const { name, email, phone, work, password, cpassword } = req.body;
  
      if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "All fields are required" });
      }
  
      const userExist = await User.findOne({ email: email });
  
      if (userExist) {
        return res.status(422).json({ error: "Email already exists" });
      }else if(password!=cpassword){
        return res.status(422).json({ error: "password is not matching" });
      }else{
        const user = new User({ name, email, phone, work, password, cpassword });
      
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
      }
  
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to register" });
    }
  });

//login route
router.post('/signin',async (req,res)=>{
    // console.log(req.body);
    // res.json({message:"Done"});
    try {
      
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error:"Please fill the data"})
        }
        const userLogin = await User.findOne({email:email});

        if (userLogin) {
          const isMatch = await bcrypt.compare(password,userLogin.password);

          const token = await userLogin.generateAuthToken();
          console.log(token);

          // res.cookie("jwtoken",token,{
          //   expires:new Date(Date.now()+25892000000),//edit:commented
          //   httpOnly:true
          // });

        if (!isMatch) {
            res.status(400).json({error:"Invalid"});
        }else{
            res.json({message:"user signed in successfully",token:token});//edit:server passing token as response
            // console.log(res);
        }
        }else{
          res.status(400).json({error:"Invalid"});
        }

        
        
    } catch (err) {
        console.log(err);
    }
});

router.get('/about',authenticate, (req, res) => {
      console.log(`Hello my About`);
      res.send(req.rootUser);
  });

router.get('/getdata',authenticate, (req, res) => {
  console.log(`Hello my getdata`);
  res.send(req.rootUser);
}); 

router.post('/contact',authenticate, async(req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      console.log("Error in contact form");
      return res.json({ error: "All fields are required" });
    }
    const userContact = await User.findOne({_id:req.userID});
    if (userContact) {
      const userMessage = await userContact.addMessage(name,email,message);
      await userContact.save();
      res.status(201).json({message:"user contact successful"});    
    }
  } catch (error) {
    
  }
}); 

router.get('/logout', (req, res) => {
  console.log(`Hello my Logout page`);
  res.clearCookie('jwtoken',{path:'/'})
  res.status(200).send("user Logout");
});


module.exports = router;  