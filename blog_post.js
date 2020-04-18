const mongodb=require('mongodb')
const mongoURI = 'mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';

function post_blog(blogdetail,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        let database=dbclient.db('test')
        database.collection('bloginfo').insertOne(blogdetail,(error)=>{
            if(error){
                console.log('post failed',error)
            }
            let obj={
                blogid:blogdetail._id.toString(),
                likename:{}
            }

            database.collection('bloglike').insertOne(obj,(error)=>{
                if(error){
                    console.log('like post failed',error)
                }
                res.send('successful')    
            })
        })
    })
}
function get_blog(res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('bloginfo').find({}).toArray().then(data=>{
            res.send(data)
        })
    })
}
function get_each_blog(obj,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connection failed')
        }
        dbclient.db('test').collection('bloginfo').find({_id: mongodb.ObjectID(obj)}).toArray().then(data=>{
            if(data.length===0){
                res.send('nodata')
            }
            else{
                res.send(data)
            }
        })
    })
}
function handle_like_blog(likedetail,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connection failed')
        }
        dbclient.db('test').collection('bloglike').find({blogid: likedetail.blog}).toArray().then(data=>{
            if(data.length===0){
                res.send('nodata')
            }
            else{
                let arr=data[0].likename
                let emailid=likedetail.email
                console.log(arr[emailid])
                if(arr[emailid]){
                    delete arr[emailid]
                    /* res.send(arr) */
                }
                else{
                    arr[emailid]=1
                    /* res.send('nodata') */
                }
                let changeobj={
                    likename:arr
                }
                dbclient.db('test').collection('bloglike').updateOne({blogid: likedetail.blog},{$set:changeobj},(err,response)=>{
                    if(err){
                        console.log('bloglike')
                        return
                    }
                    res.send({'response':'success'})
                })
            }
        })
    })
}
function get_like_blog(obj,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connection failed')
        }
        dbclient.db('test').collection('bloglike').find({blogid: obj.toString()}).toArray().then(data=>{
            if(data.length===0){
                res.send('nodata')
            }
            else{
                res.send(data)
            }
        })
    })   
}

module.exports.post_blog =post_blog
module.exports.get_blog=get_blog
module.exports.get_each_blog=get_each_blog
module.exports.handle_like_blog=handle_like_blog
module.exports.get_like_blog=get_like_blog