const Friendship = require('../models/friendship');
const User = require('../models/user');

module.exports.create = async (req, res)=>{

    try{

        
        let friendship = await Friendship.findOne({from_user: req.user.id, to_user: req.query.toUser})
        if(!friendship){
            friendship = await Friendship.findOne({from_user: req.query.toUser, to_user: req.user.id})
        }
        
        if(!friendship){
           let newfriendship=  await Friendship.create({
                from_user:req.user.id,
                to_user: req.query.toUser
            })
            
            let user = await User.findById(req.user.id);
            let user2 = await User.findById(req.query.toUser);

            user.friendships.push(newfriendship)
            user2.friendships.push(newfriendship)

            user.save();
            user2.save();
            // console.log(user.friendships)
            
            req.flash('success',"added to friends...");
        }else{
            req.flash('error'," friend already exist...");
        }
        
        return res.redirect("back");
    }catch(err){
            console.log(err);
            return res.redirect("back");
    }
}


module.exports.destroy = async (req, res)=>{
    try{

        
        let friendship = await Friendship.findOne({from_user: req.user.id, to_user: req.query.toUser})
        if(!friendship){
            friendship = await Friendship.findOne({from_user: req.query.toUser, to_user: req.user.id})
        }
        
        if(friendship){
            
            let user =await  User.findByIdAndUpdate(req.user.id, { $pull: { friendships: friendship.id } });
            
            
            let user2 = await User.findByIdAndUpdate(req.query.toUser, { $pull: { friendships: friendship.id } });
            friendship.deleteOne();
            
            
            
            req.flash('success',"removed  from friends....");
        }
        

        return res.redirect("back");
    }catch(err){
            console.log(err);
            return res.redirect("back");
    }
}