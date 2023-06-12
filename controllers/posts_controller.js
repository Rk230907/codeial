const Post = require('../models/post');
const Comment = require('../models/comment');
const postsMailer = require('../mailers/posts-mailer');
const Like = require('../models/like');


module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        post = await post.populate('user', 'name email');
        
        
        // Initiate email without queue
        postsMailer.newPost(post);


         // Using queue send emails. 
        //  let job = queue.create('emails', post).save(function(err){
        //     if(err){
        //         console.log('Error in creating a queue');
        //         return;
        //     }

        //      console.log('Job enqueued',job.id);
   
        // });  


        if (req.xhr){
            // post = await post.populate('user', 'name');
            
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }
        

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){

            // Delete the associated likes for the post and all it's comments likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            
            post.deleteOne();
            

            await Comment.deleteMany({post: req.params.id});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.log('failed');
        return res.redirect('back');
    }
    
}