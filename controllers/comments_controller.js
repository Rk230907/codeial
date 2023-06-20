const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments-mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            comment = await comment.populate('user', 'name email');


            //Initiate Email without queue.  
            // commentsMailer.newComment(comment);


            // Using queue send emails. 
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    // console.log('Error in creating a queue');S
                    return;
                }
  
                // console.log('Job enqueued',job.id);

            });  
            
            if (req.xhr){
                // Similar for comments to fetch the user's id!
                // comment = await comment.populate('user', 'name');
    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Posted!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
        
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.deleteOne();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // Destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}