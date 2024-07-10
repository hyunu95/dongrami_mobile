package com.lec.Impl;

import com.lec.entity.Review;
import com.lec.dto.ReviewDTO;
import com.lec.repository.ReviewRepository;
import com.lec.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public void saveReview(Review review) {
        reviewRepository.save(review);
    }

    @Override
    public void updateReview(int id, ReviewDTO reviewDTO) {
        Optional<Review> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            Review existingReview = optionalReview.get();
            existingReview.setRating(reviewDTO.getRating());
            existingReview.setReviewText(reviewDTO.getReviewText());
            existingReview.setReviewModify(new Date());
            reviewRepository.save(existingReview);
        } else {
            throw new RuntimeException("Review not found with id " + id);
        }
    }

    @Override
    public void deleteReview(int id) {
        Optional<Review> optionalReview = reviewRepository.findById(id);
        if (optionalReview.isPresent()) {
            reviewRepository.delete(optionalReview.get());
        } else {
            throw new RuntimeException("Review not found with id " + id);
        }
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAllWithDetails();
    }

    @Override
    public List<Review> getReviewsByMainCategory(int mainCategoryId) {
        return reviewRepository.findByMainCategory(mainCategoryId);
    }
}
