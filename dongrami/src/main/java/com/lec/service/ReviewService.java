package com.lec.service;

import com.lec.entity.Review;
import com.lec.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {
    void saveReview(Review review);
    void updateReview(int id, ReviewDTO reviewDTO);
    void deleteReview(int id);
    List<Review> getAllReviews();
    List<Review> getReviewsByMainCategory(int mainCategoryId);
}
