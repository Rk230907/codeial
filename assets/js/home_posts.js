{   
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
// method to create a post in DOM
// method to create a post in DOM
let newPostDom = function(post) {
    // CHANGE :: show the count of zero likes on this post
    return $(`
        <li id="post-${post._id}" class="post">
            <p>
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}"><i class="fas fa-trash-alt"></i></a>
                </small>
                ${post.content}<br>
                <small style="margin-left: 20px;">👤 Creator - ${post.user.name}</small><br> <br>
                <small>
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                    </a>
                </small>
            </p>
            <div class="post-comments">
                <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
                <div class="post-comments-list">
                    <ul id="post-comments-${post._id}"></ul>
                </div>
            </div>
        </li>
        <style>
            /* CSS styles for the post */
            .post {
                margin-bottom: 10px;
                padding: 10px;
                border: 1px solid #ccc;
            }

            .delete-post-button {
                padding: 4px;
                border: none;
                background-color: transparent;
                cursor: pointer;
            }

            /* Additional CSS styles for an extraordinary look */
            #post-${post._id} {
                background-color: #f9f9f9;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                margin-bottom: 10px;
                /* Add your own custom styles here */
            }

            #post-${post._id} p {
                margin: 0;
                padding-bottom: 10px;
                /* Add your own custom styles here */
            }

            #post-${post._id} small {
                font-size: 12px;
                color: #888;
                /* Add your own custom styles here */
            }

            #post-${post._id} a.delete-post-button {
                color: #f00;
                text-decoration: none;
                font-size: 12px;
                
                /* Add your own custom styles here */
            }

            #post-${post._id} a.toggle-like-button {
                color: #00f;
                text-decoration: none;
                font-size: 12px;
                margin-left: 10px; /* Add spacing between content and like button */
                /* Add your own custom styles here */
            }

            #post-${post._id} .post-comments {
                margin-top: 10px;
                /* Add your own custom styles here */
            }

            #post-${post._id} form {
                margin-bottom: 10px;
                /* Add your own custom styles here */
            }

            #post-${post._id} form input[type="text"],
            #post-${post._id} form input[type="submit"] {
                margin-bottom: 10px; /* Add space between the input elements */
            }

            #post-${post._id} input[type="text"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
                /* Add your own custom styles here */
            }

            #post-${post._id} input[type="submit"] {
                background-color: #4caf50;
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                /* Add your own custom styles here */
            }

            #post-${post._id} .post-comments-list {
                list-style-type: none;
                padding: 0;
                margin: 0;
                /* Add your own custom styles here */
            }

            #post-${post._id} .comment-item {
                margin-bottom: 10px;
                /* Add your own custom styles here */
            }

            /* Additional styling for the like and delete buttons */
            #post-${post._id} .toggle-like-button {
                /* Add your own custom styles here */
                /* Example: Change the appearance of the like button */
                padding: 4px 8px;
                border: 1px solid #00f;
                border-radius: 3px;
                background-color: #fff;
                transition: background-color 0.3s ease;
            }

            #post-${post._id} .toggle-like-button:hover {
                background-color: #00f;
                color: #fff;
            }

            #post-${post._id} .delete-post-button {
                /* Add your own custom styles here */
                /* Example: Add Font Awesome icon to the delete button */
                padding: 4px;
                border: none;
                background-color: transparent;
                cursor: pointer;
            }
        </style>
    `);
}




    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }





    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}