const express = require("express");
const router = express.Router();
require("../DB/database");
const User = require("../models/userSchema.js");
const bcrypt = require("bcryptjs");
const Authenticate=require('../middleware/authenticate.js')



router.get("/", (req, res) => {
  res.send("response from express router");
});

//Using Promises
// router.post('/register',(req,res)=>{

//     const{name, email, phone, designation, password, cpassword }=req.body;

//     if(!name ||  !email || !phone || !designation || !password ||!cpassword){

//         return res.status(422).json({error:"Please Enter Correct Details!"})

//     }

//       User.findOne({email:email})
//       .then(exist=>{
//             if(exist){
//                return res.status(422).send({error:"User Already exist"})
//             }

//            const user= new User({name,email,phone, designation, password, cpassword})
//             user.save()
//             .then(()=>res.status(201).json({message:"User Registered Successfully!"}))
//             }).catch(error=>res.status(500).json({error:"Registration Failed!"}))

//             .catch(err=>console.log(err))
// })


//using async await

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Please Enter Correct Details!" });
  }

  try {
    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(422).json({ error: "User Already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "password doesn't match!" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        work,
        password,
        cpassword,
      });

      //Using Middleware here for hasing even if password modified by user IN UserSchema.js

      await user.save();
      return res.status(201).json({ message: "user registered successfully!" });
    }
  } catch (err) {
    console.log(err);
  
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "please enter login details" });
  }


  try {
    const exist = await User.findOne({ email });

    if (exist) {
      const isMatch = await bcrypt.compare(password, exist.password);
      const token = await exist.generateAuthToken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 90000000),
        httpOnly: true,
      });


      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        return res.status(201).json({ message: "Login successfully!" });
      }
    } else {
      res.status(400).json({ error: "email doesn't exist" });
    }
  } catch (err) {
    console.log(err);
  }
});



router.get('/about',Authenticate,(req,res)=>{
       res.send(req.rootUser)
      
})


router.get('/getData',Authenticate,(req,res)=>{
  res.send(req.rootUser)
})


router.get('/logout',(req,res)=>{
  res.clearCookie('jwtoken',{path:'/'})
  res.status(200).send('User Logged out')
})


router.post('/contact',Authenticate,async(req,res)=>{

  const {name,email,phone,message}=req.body;
  
try{

  if(!name,!email,!phone,!message){
    return res.json({error:"please filled all field!"})
  }

  const userContact= await User.findOne({_id:req.userID})

  if(userContact){
    const userMessage= await userContact.addMessage(name,email,phone,message)
    await userContact.save()
    res.status(201).json({message:"your query taken successfully!"})
  }
}
catch(err){
  console.log(err)
}


})


module.exports = router;


