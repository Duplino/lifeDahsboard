// News Widget JavaScript
(function() {
    'use strict';

    class NewsWidget {
        constructor(container, settings, size) {
            this.container = container;
            this.settings = settings || {};
            this.size = size || { width: 0, height: 0 };
            this.currentIndex = 0;
            this.carouselInterval = null;
            this.newsItems = [];
            this.init();
        }

        init() {
            // Sample news data (in a real application, this would come from an API)
            this.newsItems = [
                {
                    source: 'Tech News',
                    icon: 'bi-laptop',
                    title: 'New AI Breakthrough Announced',
                    description: 'Researchers have developed a new artificial intelligence system that can understand and generate human-like text with unprecedented accuracy.',
                    time: '2 hours ago'
                },
                {
                    source: 'Science',
                    icon: 'bi-flask',
                    title: 'Climate Study Shows Positive Trends',
                    description: 'New research indicates that renewable energy adoption is accelerating faster than previously predicted, offering hope for climate goals.',
                    time: '4 hours ago'
                },
                {
                    source: 'Business',
                    icon: 'bi-graph-up',
                    title: 'Markets Rally on Economic Data',
                    description: 'Stock markets reached new highs today following better-than-expected economic indicators and strong corporate earnings reports.',
                    time: '6 hours ago'
                },
                {
                    source: 'Health',
                    icon: 'bi-heart-pulse',
                    title: 'Breakthrough in Medical Treatment',
                    description: 'Medical researchers announce promising results in a new treatment approach that could revolutionize patient care for chronic conditions.',
                    time: '8 hours ago'
                },
                {
                    source: 'Space',
                    icon: 'bi-rocket',
                    title: 'New Exoplanet Discovery',
                    description: 'Astronomers have identified a potentially habitable exoplanet orbiting a nearby star, sparking excitement in the scientific community.',
                    time: '10 hours ago'
                },
                {
                    source: 'Sports',
                    icon: 'bi-trophy',
                    title: 'Championship Finals Set',
                    description: 'After an exciting season, the championship finals matchup has been confirmed with record-breaking viewership expected.',
                    time: '12 hours ago'
                }
            ];

            this.renderNews();
            this.applyStyling();
            this.setupCarousel();
        }

        renderNews() {
            const carousel = this.container.querySelector('.news-carousel');
            if (!carousel) return;

            carousel.innerHTML = '';

            this.newsItems.forEach((item, index) => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                if (index === 0) {
                    newsItem.classList.add('active');
                }

                newsItem.innerHTML = `
                    <div class="news-item-header">
                        <i class="bi ${item.icon} news-item-icon"></i>
                        <span class="news-item-source">${item.source}</span>
                    </div>
                    <h6 class="news-item-title">${item.title}</h6>
                    <p class="news-item-description">${item.description}</p>
                    <div class="news-item-time">${item.time}</div>
                `;

                carousel.appendChild(newsItem);
            });

            this.renderDots();
        }

        renderDots() {
            const dotsContainer = this.container.querySelector('.carousel-dots');
            if (!dotsContainer) return;

            dotsContainer.innerHTML = '';

            this.newsItems.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (index === 0) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => this.goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        applyStyling() {
            const widget = this.container.closest('.widget');
            if (!widget) return;

            // Reset classes
            widget.classList.remove('news-small', 'news-medium', 'news-large');

            // Small widget (show 1 item with carousel)
            if (this.size.width <= 2 || this.size.height <= 2) {
                widget.classList.add('news-small');
                this.showCarousel();
            }
            // Medium widget (show 2 items, no carousel)
            else if (this.size.width === 3 || this.size.height === 3) {
                widget.classList.add('news-medium');
                this.showMultiple(2);
            }
            // Large widget (show 3+ items, scrollable)
            else if (this.size.width >= 4 || this.size.height >= 4) {
                widget.classList.add('news-large');
                this.showMultiple(6);
            }
        }

        showCarousel() {
            const items = this.container.querySelectorAll('.news-item');
            items.forEach((item, index) => {
                item.classList.toggle('active', index === this.currentIndex);
                item.style.position = 'absolute';
                item.style.display = index === this.currentIndex ? 'block' : 'none';
            });

            // Show carousel controls
            const controls = this.container.querySelector('.carousel-controls');
            if (controls) {
                controls.style.display = 'flex';
            }

            this.startCarousel();
        }

        showMultiple(count) {
            const items = this.container.querySelectorAll('.news-item');
            items.forEach((item, index) => {
                item.classList.add('active');
                item.style.position = 'relative';
                item.style.display = index < count ? 'block' : 'none';
            });

            // Hide carousel controls
            const controls = this.container.querySelector('.carousel-controls');
            if (controls) {
                controls.style.display = 'none';
            }

            this.stopCarousel();
        }

        setupCarousel() {
            const prevBtn = this.container.querySelector('.prev-btn');
            const nextBtn = this.container.querySelector('.next-btn');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.prevSlide());
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextSlide());
            }
        }

        startCarousel() {
            this.stopCarousel();
            this.carouselInterval = setInterval(() => {
                this.nextSlide();
            }, 5000); // Auto-advance every 5 seconds
        }

        stopCarousel() {
            if (this.carouselInterval) {
                clearInterval(this.carouselInterval);
                this.carouselInterval = null;
            }
        }

        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
            this.updateCarousel();
        }

        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.newsItems.length) % this.newsItems.length;
            this.updateCarousel();
        }

        goToSlide(index) {
            this.currentIndex = index;
            this.updateCarousel();
            this.startCarousel(); // Restart the auto-advance timer
        }

        updateCarousel() {
            const items = this.container.querySelectorAll('.news-item');
            const dots = this.container.querySelectorAll('.carousel-dot');

            items.forEach((item, index) => {
                item.classList.toggle('active', index === this.currentIndex);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        onResize(size) {
            // Called when the widget is resized
            this.size = size;
            this.applyStyling();
        }

        updateSettings(settings) {
            this.settings = settings;
            // Re-initialize if needed
        }

        destroy() {
            // Cleanup when widget is removed
            this.stopCarousel();
        }
    }

    // Export to global scope
    window.NewsWidget = NewsWidget;
})();
