const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser');
const app = express();
const schema=require('./user_info')
const blogschema=require('./blog_post')

app.use(cors())
app.use(bodyParser.json())

//user registration
app.post('/user',(req,res)=>{
    let senderbody={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    schema.user_register(senderbody,res)
})
//user login
app.post('/user/login',(req,res)=>{
    let email=req.body.email
    let password=req.body.password
    console.log(email,password)
    schema.user_login(email,password,res)
})
//checking user presence
app.get('/user/validity/:email',(req,res)=>{
    schema.user_presence(req.params.email,res)
})
app.post('/blog/post',(req,res)=>{
    let indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    let blogdetail={
        email:req.body.email,
        author:req.body.author,
        title:req.body.title,
        description:req.body.description,
        blogbody:req.body.blogbody,
        date:Date(new Date(indiaTime))
    }
    let str=blogdetail.date
    str=str.replace('GMT+0530 (India Standard Time)',' ')
    blogdetail.date=str
    blogschema.post_blog(blogdetail,res)
})
app.get('/get/allblog',(req,res)=>{
    blogschema.get_blog(res)  
})
app.get('/get/eachblog/:id',(req,res)=>{ 
    blogschema.get_each_blog(req.params.id,res)
})
app.post('/like/post',(req,res)=>{
    let likedetail={
        email:req.body.email,
        blog:req.body.blogid
    }
    blogschema.handle_like_blog(likedetail,res)
})
app.get('/like/get/:id',(req,res)=>{
    blogschema.get_like_blog(req.params.id,res)
})

const PORT =process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));