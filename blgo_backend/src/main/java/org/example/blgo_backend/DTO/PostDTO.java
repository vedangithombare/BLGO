package org.example.blgo_backend.DTO;


import java.util.Arrays;

//this dto is used for fetching the data coming from the user from frontend
public class PostDTO {
    private String data;
    private String coverImg;
    private String tags;



    public PostDTO(String data, String coverImg, String tags) {
        this.data = data;
        this.coverImg = coverImg;
        this.tags = tags;
    }


    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getCoverImg() {
        return coverImg;
    }

    public void setCoverImg(String coverImg) {
        this.coverImg = coverImg;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "PostDTO{" +
                "data='" + data + '\'' +
                ", coverImg='" + coverImg + '\'' +
                ", tags=" + tags +
                '}';
    }
}
