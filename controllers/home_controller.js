const Post = require('../models/post');
const User = require('../models/user');



module.exports.home = async function(req, res){

    try{
         // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');
    
        // let users = await User.find({});

        if(req.isAuthenticated()){
            let users = await User.find({});
            let user = await User.findById(req.user._id)
            .populate({
                path: 'friendships',
                populate: {
                    path: 'from_user to_user',
                }
            })


            let friends =await  user.friendships;
            // let friends = await user.populate('friendships');
            // console.log(friends)
            return res.render('home', {
                title: "Codeial | Home",
                subtitle: "Home",
                posts: posts,
                all_users: users,
                friends: friends
            });

        }else{
            let users = await User.find({});
            return res.render('home', {
                title: "Codeial | Home",
                subtitle: "Home",
                posts: posts,
                all_users: users,
            });
        }


    }catch(err){
        console.log('Error', err);
        return;
    }
   
}
