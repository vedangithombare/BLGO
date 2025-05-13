package org.example.blgo_backend.Repository;

import org.example.blgo_backend.Entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface Users extends CrudRepository<User,Integer>{

    public Optional<User> findByUserName(String userName);
    public Optional<User> findByEmail(String email);

}


