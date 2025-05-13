package org.example.blgo_backend.Service;


import jakarta.servlet.http.HttpServletRequest;
import org.example.blgo_backend.DTO.PostDTO;
import org.example.blgo_backend.DTO.PostDisplayDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PostService {

    public ResponseEntity<?> publishPost(PostDTO postDTO, HttpServletRequest request);

    public List<PostDisplayDTO> getPosts(HttpServletRequest request);

    PostDisplayDTO showPost(Integer postId, HttpServletRequest request);

    List<PostDisplayDTO> showAllPosts(HttpServletRequest request);

    ResponseEntity<?> deletePost(Integer postId, HttpServletRequest request);

    ResponseEntity<String> updatePost(Integer postId, PostDTO postDisplayDTO, HttpServletRequest request);
}
