package org.example.blgo_backend.Repository;

import org.example.blgo_backend.Entity.Post;

import org.example.blgo_backend.Entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface Posts extends CrudRepository<Post, Integer> {


    List<Post> findByUserAndIsDeleted(User user, Boolean isDeleted);

    Optional<Post> findByPostIdAndIsDeleted(Integer postId, Boolean isDeleted);

    List<Post> findAllByIsDeleted(Boolean isDeleted);

    User user(User user);
}


