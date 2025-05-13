package org.example.blgo_backend.Service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.blgo_backend.DTO.PostDTO;
import org.example.blgo_backend.DTO.PostDisplayDTO;
import org.example.blgo_backend.Entity.Post;
import org.example.blgo_backend.Entity.User;
import org.example.blgo_backend.Repository.Posts;
import org.example.blgo_backend.Repository.Users;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PostServiceImpl implements PostService {

    private final Posts postRepo;
    private final UserService userService;

    public PostServiceImpl(Posts postRepo, UserService userService) {
        this.postRepo = postRepo;
        this.userService = userService;
    }

    private String[] extractTitleAndContent(String postData) {

        String[] titleAndContent = new String[2];
        Pattern titlePattern = Pattern.compile("<h1>.*?</h1>");
        Matcher titleMatcher = titlePattern.matcher(postData);

        if (titleMatcher.find()) {
            String getTitle = titleMatcher.group();
            titleAndContent[0] = getTitle;

            int titleEndIndex = postData.indexOf("</h1>");
            if (titleEndIndex < postData.length()) {
                titleAndContent[1] = postData.substring(titleEndIndex);
            } else {
                titleAndContent[1] = "";
            }
        } else {
            titleAndContent[0] = "";
            titleAndContent[1] = postData;
        }
        return titleAndContent;
    }

    private Boolean validatePostContent(String[] titleContent){

        boolean isTitle = titleContent[0] != null && !titleContent[0].isBlank();
        boolean isContent = titleContent[1] !=null && !titleContent[1].isBlank();
        return isTitle && isContent;
    }

    //publishing post
    @Override
    public ResponseEntity<?> publishPost(PostDTO postDTO, HttpServletRequest request) {
        try {

            // getting the user
            User user = userService.getAuthenticatedUserResponse(request).getBody();
            System.out.println("GETTING THE USER FROM THE POSTSERVICEIMPL: " + user);

            String postData = postDTO.getData();
            if (postData == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post data cannot be null");
            }

            String[] titleContent = extractTitleAndContent(postData);

            if(!validatePostContent(titleContent)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post should contain both title and content");
            }

            // separating the title and the content
            String title = titleContent[0];
            String postStory = titleContent[1];

            Post postEntity = new Post();
            // saving post content in the database
            postEntity.setUser(user);
            postEntity.setTitle(title);
            postEntity.setContent(postStory);
            postEntity.setCoverImg(postDTO.getCoverImg());
            postEntity.setTags(postDTO.getTags());
            postEntity.setDeleted(false);
//            by default the likes will be 0
            postEntity.setLikes(0);
            postRepo.save(postEntity);
            return new ResponseEntity<>("Post created successfully", HttpStatus.ACCEPTED);

        } catch (Exception e) {
            System.out.println("Error processing token: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }


    // showing my-stories i.e posts written by specific user
    @Override
    public List<PostDisplayDTO> getPosts(HttpServletRequest request) {
        // this should return an object with post-entity data
        System.out.println("REQUEST: " + request.getCookies());
        User user = userService.getAuthenticatedUserResponse(request).getBody();
        int authUserId = user.getUserId();

        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        //got the user
        String postAuthor = user.getUserName();

        //getting all posts from the database
        List<Post> userPosts = postRepo.findByUserAndIsDeleted(user, false);

        List<PostDisplayDTO> postDTOsList = new ArrayList<>();

        for (Post post : userPosts) {

            int postOwnerUserId = post.getUser().getUserId();
            PostDisplayDTO postDTO = new PostDisplayDTO();

            postDTO.setPostId(post.getPostId());
            postDTO.setPostAuthor(postAuthor);
            postDTO.setPostTitle(post.getTitle());
            postDTO.setPostArticle(post.getContent());
            postDTO.setPostCoverImg(post.getCoverImg());
            postDTO.setPostTags(post.getTags());
            postDTO.setPostLikeCount(post.getLikes());
            postDTO.setPostEditedDate(post.getEditedAt());
            postDTO.setPostPublishDate(post.getCreatedAt());
            postDTO.setPostOwner(authUserId == postOwnerUserId);

            postDTOsList.add(postDTO);
        }

        return postDTOsList;
    }


    // retriving one single article/post by using postId
    @Override
    public PostDisplayDTO showPost(Integer postId, HttpServletRequest request) {

        User user = userService.getAuthenticatedUserResponse(request).getBody();
        // checking who is the user logged in
        int authUserId = user.getUserId();

        Optional<Post> article = postRepo.findByPostIdAndIsDeleted(postId, false);

        // Check if the post exists
        if (article.isEmpty()) {
            throw new RuntimeException("Post with ID " + postId + " not found or has been deleted");
        }

        //  checking the post owner user id
        int postOwnerUserId = article.get().getUser().getUserId();

        PostDisplayDTO postDisplayDTO = new PostDisplayDTO();

        postDisplayDTO.setPostId(postId);
        postDisplayDTO.setPostAuthor(article.get().getUser().getUserName());
        postDisplayDTO.setPostTitle(article.get().getTitle());
        postDisplayDTO.setPostArticle(article.get().getContent());
        postDisplayDTO.setPostCoverImg(article.get().getCoverImg());
        postDisplayDTO.setPostTags(article.get().getTags());
        postDisplayDTO.setPostEditedDate(article.get().getEditedAt());
        postDisplayDTO.setPostPublishDate(article.get().getCreatedAt());
        postDisplayDTO.setPostOwner(authUserId == postOwnerUserId);

        return postDisplayDTO;
    }

    // retriving all posts for displaying in home page
    @Override
    public List<PostDisplayDTO> showAllPosts(HttpServletRequest request) {

        User user = userService.getAuthenticatedUserResponse(request).getBody();

        int authUserId = user.getUserId();

        List<Post> allUserPosts = postRepo.findAllByIsDeleted(false);
        List<PostDisplayDTO> postDTOsList = new ArrayList<>();

        for (Post post : allUserPosts) {

            int postOwnerUserId = post.getUser().getUserId();
            PostDisplayDTO postDisplayDTO = new PostDisplayDTO();

            postDisplayDTO.setPostId(post.getPostId());
            postDisplayDTO.setPostAuthor(post.getUser().getUserName());
            postDisplayDTO.setPostTitle(post.getTitle());
            postDisplayDTO.setPostArticle(post.getContent());
            postDisplayDTO.setPostCoverImg(post.getCoverImg());
            postDisplayDTO.setPostTags(post.getTags());
            postDisplayDTO.setPostLikeCount(post.getLikes());
            postDisplayDTO.setPostEditedDate(post.getEditedAt());
            postDisplayDTO.setPostPublishDate(post.getCreatedAt());
            postDisplayDTO.setPostOwner(authUserId == postOwnerUserId);

            postDTOsList.add(postDisplayDTO);
        }
        return postDTOsList;
    }

    //delete post with postid
    @Override
    public ResponseEntity<?> deletePost(Integer postId, HttpServletRequest request) {

        User user = userService.getAuthenticatedUserResponse(request).getBody();
        Integer authUserId = user.getUserId();

        Optional<Post> findPost = postRepo.findById(postId);
        if (findPost.isEmpty()) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post with ID " + postId + " not found");
        }
        Post post = findPost.get();

        if (post.getDeleted()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post with ID " + postId + " is already deleted");
        }

        int postOwnerUserId = post.getUser().getUserId();

        if (authUserId.equals(postOwnerUserId)) {
            post.setDeleted(true);
            postRepo.save(post);
            return ResponseEntity.status(HttpStatus.OK).body("Post with ID " + postId + " was deleted");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You don't have permission to delete this post");
        }

    }

    //updating the post
    /* check if the owner who is changing the data is the owner of the account
     * then check if the data received is empty or not if it then dont change anything
     * if its not empty then replace the data which was saved earlier
     * save the data in the backend
     * */
    @Override
    public ResponseEntity<String> updatePost(Integer postId, PostDTO postDTO, HttpServletRequest request) {
        try {
            // getting the post which is already in the database
            Optional<Post> OptionalPost = postRepo.findById(postId);
            // post is not present
            if (!OptionalPost.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post with ID " + postId + " not found");
            }

            Post post = OptionalPost.get();
            // getting the postOwner
            Integer postOwner = post.getUser().getUserId();
            // getting who is logged in
            User user = userService.getAuthenticatedUserResponse(request).getBody();
            Integer authUserId = user.getUserId();

            if (postOwner.equals(authUserId)) {
                /*check the data which we are receiving*/
                String postData = postDTO.getData();

                String[] titleContent = extractTitleAndContent(postData);

                if(!validatePostContent(titleContent)){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Post should contain both title and content");
                }

                // separating the title and the content
                String title = titleContent[0];
                String postStory = titleContent[1];

                if (title != null && !title.isBlank()) {
                    post.setTitle(title);
                }
                if (postStory != null && !postStory.isBlank()) {
                    post.setContent(postStory);
                }
                if (postDTO.getCoverImg() != null && !postDTO.getCoverImg().isBlank()) {
                    post.setCoverImg(postDTO.getCoverImg());
                }
                if (postDTO.getTags() != null && !postDTO.getTags().isBlank()) {
                    post.setTags(postDTO.getTags());
                }

                post.setEditedAt(LocalDateTime.now());

                postRepo.save(post);
                return new ResponseEntity<>("Post Successfully updated", HttpStatus.OK);

            } else {
                return new ResponseEntity<>("You are not authorised to edit this post", HttpStatus.FORBIDDEN);
            }

        } catch (NullPointerException e) {
            System.out.println("Error processing user data: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user data");
        } catch (Exception e) {
            System.out.println("Error updating post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating post");
        }
    }
}
