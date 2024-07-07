$(document).ready(function() {
    function calculateAverageRating() {
        let totalStars = 0;
        let reviewCount = reviews.length;

        reviews.forEach(review => {
            totalStars += review.rating;
        });

        const averageRating = (totalStars / reviewCount).toFixed(1);
        return { averageRating, reviewCount };
    }

    function renderReviews(filteredReviews = reviews) {
        const reviewsContainer = $('#reviews');
        reviewsContainer.empty();

        filteredReviews.forEach(review => {
            const reviewPost = `
                <div class="review-post" data-category="${review.category}">
                    <img src="/images/basic.png" alt="${review.title}">
                    <h2>${review.title}</h2>
                    <p class="review-author">BY ${review.author} | ${review.date} | <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span></p>
                    <p class="review-excerpt">${review.content}</p>
                    <a href="about.html" class="review-read-more">타로보러가기 »</a>
                </div>
            `;
            reviewsContainer.append(reviewPost);
        });
    }

    function updateReviewSummary() {
        const { averageRating, reviewCount } = calculateAverageRating();
        $('#review-count').text(reviewCount);
        $('.rating-value').text(averageRating);
        $('.rating-details').text(`${reviewCount}개의 리뷰`);

        $('.stars .star').each(function(index) {
            if (index < Math.floor(averageRating)) {
                $(this).addClass('filled');
            } else if (index < averageRating) {
                $(this).addClass('half-filled');
            } else {
                $(this).removeClass('filled').removeClass('half-filled');
            }
        });
    }

    // 필터 버튼 클릭 이벤트
    $('.filter-btn').click(function() {
        const category = $(this).data('category');

        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        if (category === 'all') {
            renderReviews(reviews);
        } else {
            const filteredReviews = reviews.filter(review => review.category === category);
            renderReviews(filteredReviews);
        }
        updateReviewSummary();
    });

    renderReviews();
    updateReviewSummary();
});
