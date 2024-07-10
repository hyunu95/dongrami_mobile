$(document).ready(function () {
    const $reviewForm = $('#reviewForm');
    let editingReviewId = null;

    // 리뷰 텍스트 입력 시 글자 수 업데이트
    $('#custom-review-text').on('input', function() {
        const currentLength = $(this).val().length;
        $('#custom-character-count').text(`${currentLength}/50`);
    });

    $reviewForm.submit(function (event) {
        event.preventDefault();

        const reviewText = $('#custom-review-text').val().trim();
        const rating = parseInt($('#ratingScore').val());
        const userId = '현재_로그인된_사용자_ID'; // 실제 로그인된 사용자 ID를 사용
        const subcategoryId = 1; // 예시 값
        const resultId = 1; // 예시 값

        // 유효성 검사
        if (!reviewText) {
            alert('리뷰 텍스트를 입력해 주세요.');
            return;
        }
        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert('유효한 평점을 입력해 주세요 (1-5).');
            return;
        }

        const review = {
            rating: rating,
            reviewText: reviewText,
            reviewCreate: new Date().toISOString(),
            user_id: userId,
            subcategory_id: subcategoryId,
            result_id: resultId
        };

        const method = editingReviewId ? 'PUT' : 'POST';
        const url = editingReviewId ? `/review/api/reviews/${editingReviewId}` : '/review/api/reviews';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(review),
            success: function () {
                alert(`리뷰가 성공적으로 ${method === 'PUT' ? '수정' : '저장'}되었습니다.`);
                loadReviews();
                closeModal(); // 리뷰 저장 후 모달 닫기
                editingReviewId = null; // 수정 완료 후 초기화
            },
            error: function (xhr) {
                console.error(`Error ${editingReviewId ? 'updating' : 'saving'} review:`, xhr);
                alert(`리뷰 저장 중 오류가 발생했습니다: ${xhr.responseText}`);
            }
        });
    });

    function loadReviews(mainCategoryId = null) {
        const url = mainCategoryId ? `/review/api/reviews/${mainCategoryId}` : '/review/api/reviews';
        $.get(url, function (reviews) {
            if (!Array.isArray(reviews)) {
                throw new Error('Invalid response format');
            }

            const $reviewContainer = $('#reviews');
            $reviewContainer.empty(); // 기존 리뷰 제거

            let totalRating = 0;

            reviews.forEach(review => {
                const reviewDate = new Date(review.reviewCreate).toLocaleDateString(); // 날짜 형식 변환
                const $reviewCard = $(`
                    <div class="review-card">
                        <h3 class="review-title"># ${review.subcategory.bubble_slack_name}</h3>
                        <div class="review-meta">
                            BY ${review.member.nickname || 'Unknown'} | ${reviewDate} |
                            <span class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                        </div>
                        <p class="review-text">${review.reviewText || 'No content'}</p>
                        <button class="edit-review-btn" data-review-id="${review.reviewId}" data-nickname="${review.member.nickname}" data-bubble-slack-name="${review.subcategory.bubble_slack_name}" data-rating="${review.rating}" data-review-text="${review.reviewText}">수정</button>
                        <button class="go-to-tarot-btn" onclick="goToTarot(${review.subcategory.subcategoryId})">해당 타로 보러가기>></button>
                    </div>
                `);
                $reviewContainer.append($reviewCard);

                totalRating += review.rating;
            });

            const reviewCount = reviews.length;
            const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

            $('#review-count').text(reviewCount);
            $('.review-rating-value').text(averageRating);
            $('.review-rating-details').text(`${reviewCount}개의 리뷰`);

            fillStars(averageRating);

            $('.edit-review-btn').click(function () {
                const $this = $(this);
                const reviewId = $this.data('review-id');
                const nickname = $this.data('nickname');
                const bubbleSlackName = $this.data('bubble-slack-name');
                const rating = $this.data('rating');
                const reviewText = $this.data('review-text');
                openEditModal(reviewId, nickname, bubbleSlackName, rating, reviewText);
            });
        }).fail(function (xhr) {
            console.error('Error fetching reviews:', xhr);
            alert('리뷰를 불러오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        });
    }

    function fillStars(averageRating) {
        const $reviewStars = $('#average-review-stars').children();
        const filledStars = Math.floor(averageRating);
        const hasHalfStar = (averageRating - filledStars) >= 0.5;

        $reviewStars.removeClass('filled half-filled');
        $reviewStars.each(function (index) {
            if (index < filledStars) {
                $(this).addClass('filled');
            } else if (index === filledStars && hasHalfStar) {
                $(this).addClass('half-filled');
            }
        });
    }

    function openEditModal(reviewId, nickname, bubbleSlackName, rating, reviewText) {
        editingReviewId = reviewId; // 여기서 reviewId가 올바르게 설정되는지 확인
        $('#custom-review-text').val(reviewText);
        $('#ratingScore').val(rating);
        $('.custom-modal-rating-score').text(rating + '점');
        $('.custom-user-name').text(nickname);
        $('.custom-user-role').text(`#${bubbleSlackName}`);
        updateStars(rating); // 별 색상을 업데이트하는 함수 호출
        const currentLength = reviewText.length;
        $('#custom-character-count').text(`${currentLength}/50`); // 글자 수 업데이트
        $('#reviewModal').show();
        $('body').addClass('modal-open');
    }

    function updateStars(rating) {
        // 모든 별을 기본 색상으로 초기화
        $('#custom-modal-rating .custom-modal-star').each(function(index) {
            if (index < rating) {
                $(this).css('color', '#ffd700').text('★'); // 채워진 별 색상 설정
            } else {
                $(this).css('color', '#ddd').text('☆'); // 빈 별 색상 설정
            }
        });
    }

    function submitEditReview() {
        const reviewText = $('#custom-review-text').val().trim();
        const rating = parseInt($('#ratingScore').val());

        if (!reviewText) {
            alert('리뷰 텍스트를 입력해 주세요.');
            return;
        }
        if (isNaN(rating) || rating < 1 || rating > 5) {
            alert('유효한 평점을 입력해 주세요 (1-5).');
            return;
        }

        if (!editingReviewId) {
            alert('수정할 리뷰가 선택되지 않았습니다.');
            return;
        }

        const review = {
            rating: rating,
            reviewText: reviewText,
        };

        const url = `/review/api/reviews/${editingReviewId}`;
        $.ajax({
            url: url,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(review),
            success: function () {
                alert('리뷰가 성공적으로 수정되었습니다.');
                loadReviews();
                closeModal();
                editingReviewId = null;
            },
            error: function (xhr) {
                console.error('PUT 요청 중 오류 발생:', xhr);
                alert('서버에 PUT 요청 중 오류가 발생했습니다.');
            }
        });
    }

    function deleteReview() {
        if (!editingReviewId) {
            alert('삭제할 리뷰가 선택되지 않았습니다.');
            return;
        }

        const url = `/review/api/reviews/${editingReviewId}`;
        $.ajax({
            url: url,
            method: 'DELETE',
            success: function () {
                alert('리뷰가 성공적으로 삭제되었습니다.');
                loadReviews();
                closeModal();
                editingReviewId = null;
            },
            error: function (xhr) {
                console.error('DELETE 요청 중 오류 발생:', xhr);
                alert('리뷰 삭제 중 오류가 발생했습니다.');
            }
        });
    }

    $('#custom-update-review').click(function () {
        submitEditReview();
    });

    $('#custom-delete-review').click(function () {
        deleteReview();
    });

    window.closeModal = function () {
        $('#reviewModal').hide();
        $('body').removeClass('modal-open');
        editingReviewId = null;
    };

    $('.review-filter-btn').click(function () {
        const mainCategoryId = $(this).data('category');
        loadReviews(mainCategoryId);
    });

    loadReviews();
});

function goToTarot(subcategoryId) {
    window.location.href = `/tarotlist?subcategory_id=${subcategoryId}`;
}
