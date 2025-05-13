package org.example.blgo_backend.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.blgo_backend.DTO.PostDTO;
import org.example.blgo_backend.DTO.PostDisplayDTO;
import org.example.blgo_backend.Service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PostAPI {

    private final PostService postService;

    public PostAPI(PostService postService) {
        this.postService = postService;
    }

    //publishing the posts
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/publish")
    public ResponseEntity<?> publishPost(@RequestBody PostDTO postDTO, HttpServletRequest request) {
        System.out.println("received post data: " + postDTO);
        return postService.publishPost(postDTO, request);
    }

    //retriving the user specific post data from the db
    @GetMapping("/api/profile/my-stories")
    public List<PostDisplayDTO> displayPosts(HttpServletRequest request) {
        System.out.println("publish post api" + request.getHeader("User-Agent"));
        return postService.getPosts(request);
    }

    // retriving article by post id
    @GetMapping("/api/article/{postId}")
    public PostDisplayDTO showArticle(@PathVariable Integer postId, HttpServletRequest request) {
        System.out.println("postId: " + postId);
        return postService.showPost(postId, request);
    }

    // retriving all posts for home page
    @GetMapping("/api/home")
    public List<PostDisplayDTO> showAllPosts(HttpServletRequest request) {

        return postService.showAllPosts(request);
    }

    //Deleting post by its post id
    @DeleteMapping("/api/article/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Integer postId, HttpServletRequest request) {
        System.out.print("Post deleted with id: " + postId);
        return postService.deletePost(postId, request);
    }

//    converting the postdisplaydto to postdto
    @PutMapping("/api/edit/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable Integer postId, @RequestBody PostDTO postDTO, HttpServletRequest request) {
        System.out.print("Post updated with id: " + postId);
        return  postService.updatePost(postId,postDTO,request);
    }
}
