document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('owl-card');
    if (!container) {
        console.error("Element with ID 'owl-card' not found");
        return;
    }
    container.style.transformStyle = 'preserve-3d';
    
    const content = document.querySelector('.services-caption');
    const owlImage = document.getElementById('basic-tarot-image');
    const cardCount = 20;
    const startAngle = -(Math.PI / 300);
    const maxEndAngle = 3 * Math.PI / 3;
    const visibleAngleRange = maxEndAngle - startAngle;
    const delayBetweenCards = 15;
    let isCardsFanned = false;
    let radius = 1.0;
    let owlCenterX, owlCenterY;
    let selectedCard = null;
    let selectedCardStartTime = null;
    const maxScaleRatio = 1.1;
    const cardDiv = document.getElementById('card1');

    const cards = [];
    let selectedCount = 0;

    function updateOwlCenter() {
        const owlRect = owlImage.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        owlCenterX = owlRect.left + owlRect.width / 2 - 158; // 값이 클수록 왼쪽으로 감
        owlCenterY = owlRect.top + owlRect.height / 2 - 450; // 값이 클수록 위로 올라감
    }

    function resizeHandler() {
        const cardWidth = 50;
        const cardHeight = 100;
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        radius = Math.min(contentWidth, contentHeight) * 0.4;

        updateOwlCenter();

        if (isCardsFanned) {
            cards.forEach((cardObj, index) => {
                if (cardObj !== selectedCard && !cardObj.isMovedToDiv) {
                    const angle = (index / (cardCount - 1)) * visibleAngleRange + startAngle;
                    const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2;
                    const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
                    cardObj.element.style.width = `${cardWidth}px`;
                    cardObj.element.style.height = `${cardHeight}px`;
                    cardObj.element.style.transition = 'transform 0s';
                    cardObj.element.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                    cardObj.x = x;
                    cardObj.y = y;
                    cardObj.angle = angle + Math.PI / 2;
                }
            });
        }
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('load', function() {
        updateOwlCenter();
        resizeHandler();
    });

    function fanCards() {
        if (isCardsFanned) return;
        isCardsFanned = true;
        const cardWidth = 50;
        const cardHeight = 100;

        updateOwlCenter();

        for (let i = 0; i < cardCount; i++) {
            setTimeout(() => {
                const angle = (i / (cardCount - 1)) * visibleAngleRange + startAngle;
                const x = owlCenterX + radius * Math.cos(angle) - cardWidth / 2;
                const y = owlCenterY + radius * Math.sin(angle) - cardHeight / 2;
                const card = document.createElement('div');
                card.className = 'card';
                card.style.width = `${cardWidth}px`;
                card.style.height = `${cardHeight}px`;
                card.style.transform = `translate(${x}px, ${y}px) rotate(${angle + Math.PI / 2}rad)`;
                card.style.opacity = 1;
                card.style.position = 'absolute';
                card.style.zIndex = '2';
                card.style.backgroundImage = 'url(/images/owl-card.jpg)';
                card.style.backgroundSize = 'cover';
                container.appendChild(card);

                const cardObj = {
                    element: card,
                    x: x,
                    y: y,
                    angle: angle + Math.PI / 2,
                    isMovedToDiv: false,
                };
                cards.push(cardObj);

                card.addEventListener('mouseover', onMouseOver);
                card.addEventListener('mouseout', onMouseOut);
                card.addEventListener('click', onCardClick);
            }, i * delayBetweenCards);
        }
    }

    function onMouseOver(e) {
        e.preventDefault();
        const cardObj = cards.find(c => c.element === this);
        if (selectedCard !== null && selectedCard !== cardObj) {
            selectedCard.element.style.transform = `translate(${selectedCard.x}px, ${selectedCard.y}px) rotate(${selectedCard.angle}rad) scale(1)`;
            selectedCardStartTime = null;
            selectedCard = null;
        }
        selectedCard = cardObj;
        selectedCardStartTime = Date.now();
        cardObj.element.style.transformOrigin = 'center center';
        cardObj.element.style.transform = `translate(${cardObj.x}px, ${cardObj.y}px) rotate(${cardObj.angle}rad) scale(${maxScaleRatio})`;
    }

    function onMouseOut() {
        const cardObj = cards.find(c => c.element === this);
        if (selectedCard === cardObj) {
            cardObj.element.style.transform = `translate(${cardObj.x}px, ${cardObj.y}px) rotate(${cardObj.angle}rad) scale(1)`;
            selectedCardStartTime = null;
            selectedCard = null;
        }
    }

    function onCardClick() {
        if (selectedCard && selectedCount < 1) {
            cardDiv.appendChild(selectedCard.element);
            selectedCard.element.style.transform = '';
            selectedCard.element.style.position = 'relative';
            selectedCard.element.style.top = '0';
            selectedCard.element.style.left = '0';
            selectedCard.element.style.pointerEvents = 'none';
            selectedCard.isMovedToDiv = true;
            selectedCount++;

            selectedCard.element.removeEventListener('mouseover', onMouseOver);
            selectedCard.element.removeEventListener('mouseout', onMouseOut);
            selectedCard.element.removeEventListener('click', onCardClick);

            selectedCard = null;

            if (selectedCount === 1) {
                const showResultButton = document.getElementById('showResultButton');
                if (showResultButton) {
                    showResultButton.style.display = 'flex';
                }
            }
        } else if (selectedCount >= 1) {
            console.log('You have already selected the maximum number of cards.');
        } else {
            console.error('No card selected');
        }
    }

    // DOM 로드 직후 fanCards 함수 실행
    fanCards();
});