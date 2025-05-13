package org.example.blgo_backend.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
//@AllArgsConstructor
//@NoArgsConstructor
public class PostDisplayDTO {

    public PostDisplayDTO() {
        // Default constructor
    }

    public PostDisplayDTO(int postId, String postTitle, String postArticle, String postCoverImg, String postTags, String postAuthor, LocalDateTime postPublishDate, LocalDateTime postEditedDate, int postLikeCount, Boolean isPostOwner) {
        this.postId = postId;
        this.postTitle = postTitle;
        this.postArticle = postArticle;
        this.postCoverImg = postCoverImg;
        this.postTags = postTags;
        this.postAuthor = postAuthor;
        this.postPublishDate = postPublishDate;
        this.postEditedDate = postEditedDate;
        this.postLikeCount = postLikeCount;
        this.isPostOwner = isPostOwner;

    }

    private int postId;
    private String postTitle;
    private String postArticle;
    private String postCoverImg;
    private String postTags;
    private String postAuthor;
    private LocalDateTime postPublishDate;
    private LocalDateTime postEditedDate;
    private int postLikeCount;
    private Boolean isPostOwner;





    public int getPostId() {
        return postId;
    }

    public void setPostId(int postId) {
        this.postId = postId;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public String getPostArticle() {
        return postArticle;
    }

    public void setPostArticle(String postArticle) {
        this.postArticle = postArticle;
    }

    public String getPostCoverImg() {
        return postCoverImg;
    }

    public void setPostCoverImg(String postCoverImg) {
        this.postCoverImg = postCoverImg;
    }

    public String getPostTags() {
        return postTags;
    }

    public void setPostTags(String postTags) {
        this.postTags = postTags;
    }

    public String getPostAuthor() {
        return postAuthor;
    }

    public void setPostAuthor(String postAuthor) {
        this.postAuthor = postAuthor;
    }

    public LocalDateTime getPostPublishDate() {
        return postPublishDate;
    }

    public void setPostPublishDate(LocalDateTime postPublishDate) {
        this.postPublishDate = postPublishDate;
    }

    public LocalDateTime getPostEditedDate() {
        return postEditedDate;
    }

    public void setPostEditedDate(LocalDateTime postEditedDate) {
        this.postEditedDate = postEditedDate;
    }

    public int getPostLikeCount() {
        return postLikeCount;
    }

    public void setPostLikeCount(int postLikeCount) {
        this.postLikeCount = postLikeCount;
    }

    public Boolean getPostOwner() {
        return isPostOwner;
    }

    public void setPostOwner(Boolean postOwner) {
        isPostOwner = postOwner;
    }


}
