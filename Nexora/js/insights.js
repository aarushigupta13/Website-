/* NEXORA INSIGHTS - EDITORIAL BLOG & CONTINUOUS SCROLLING ANIMATION MANAGER */

class InsightsManager {
  constructor() {
    this.dealtCount = 0;
    this.totalArticles = 0;
    this.isDealing = false;
    this.cardRects = [];
    this.anchorRect = null;
    this.resizeHandler = null;
    this.currentView = 'marquee'; // 'marquee' or 'deck'
  }

  init() {
    if (typeof NEXORA_DATA === 'undefined' || !NEXORA_DATA.insights) return;
    this.totalArticles = NEXORA_DATA.insights.length;
    this.dealtCount = 0;
    this.isDealing = false;
    
    this.renderMarqueeScroll();
    this.renderGrid();
    this.setupLeftDeck();
  }

  /* ---------------------------------------------------- */
  /* CONTINUOUS MARQUEE HORIZONTAL SCROLL RENDERER        */
  /* ---------------------------------------------------- */
  renderMarqueeScroll() {
    const marqueeContainer = document.getElementById('insightsMarqueeContainer');
    if (!marqueeContainer) return;

    const articles = NEXORA_DATA.insights;
    // Duplicate array to create continuous infinite scroll effect
    const duplicatedArticles = [...articles, ...articles];

    marqueeContainer.innerHTML = `
      <div class="insights-marquee-wrapper" id="insightsMarqueeWrapper">
        <div class="insights-marquee-track">
          ${duplicatedArticles.map((art, idx) => `
            <div class="marquee-card-item">
              <div class="insight-card" onclick="app.insightsManager.openInsightArticle('${art.id}')" style="height: 100%;">
                <div class="insight-card-cover">
                  <img src="${art.coverImage}" alt="${art.title}" loading="lazy">
                </div>
                
                <div class="insight-card-body">
                  <div class="insight-card-meta">
                    <span class="badge badge-trust">${art.category}</span>
                    <span class="read-time">${art.readTime}</span>
                  </div>
                  
                  <h3 class="insight-card-title">${art.title}</h3>
                  <p class="insight-card-summary">${art.summary}</p>
                </div>

                <div class="insight-card-footer">
                  <span class="insight-card-date">${art.date}</span>
                  <span class="insight-card-link">
                    <span>Read 1000-Word Guide</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ---------------------------------------------------- */
  /* GRID / DECK VIEW CARD RENDERER                       */
  /* ---------------------------------------------------- */
  renderGrid() {
    const container = document.getElementById('insightsGrid');
    if (!container) return;

    const articles = NEXORA_DATA.insights;

    container.innerHTML = articles.map((art, idx) => `
      <div class="insight-card" data-id="${art.id}" data-idx="${idx}">
        <div class="insight-card-cover">
          <img src="${art.coverImage}" alt="${art.title}" loading="lazy">
        </div>
        
        <div class="insight-card-body">
          <div class="insight-card-meta">
            <span class="badge badge-trust">${art.category}</span>
            <span class="read-time">${art.readTime}</span>
          </div>
          
          <h3 class="insight-card-title">${art.title}</h3>
          <p class="insight-card-summary">${art.summary}</p>
        </div>

        <div class="insight-card-footer">
          <span class="insight-card-date">${art.date}</span>
          <span class="insight-card-link">
            <span>Read 1000-Word Guide</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
    `).join('');
  }

  setupLeftDeck() {
    const container = document.getElementById('insightsGrid');
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.insight-card'));
    if (cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.dealtCount = this.totalArticles;
      cards.forEach(card => {
        card.style.transform = 'none';
        card.style.opacity = '1';
        card.classList.add('is-dealt');
        card.addEventListener('click', () => {
          const artId = card.getAttribute('data-id');
          this.openInsightArticle(artId);
        });
      });
      this.updateHintText();
      return;
    }

    const initialRotations = [-3, 2.5, -2, 3.5, -1.5, 4];

    const calculatePositions = () => {
      cards.forEach(card => {
        card.style.transition = 'none';
        card.style.transform = 'none';
      });

      this.anchorRect = cards[0].getBoundingClientRect();
      this.cardRects = cards.map(c => c.getBoundingClientRect());

      cards.forEach((card, idx) => {
        if (idx < this.dealtCount) {
          card.style.transition = 'none';
          card.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg) scale(1)';
          card.style.zIndex = (10 + idx).toString();
          card.style.opacity = '1';
          card.classList.add('is-dealt');
          card.classList.remove('deck-top-card');
        } else {
          const stackIdx = idx - this.dealtCount;
          const deltaX = (this.anchorRect.left - this.cardRects[idx].left) + (stackIdx * 4);
          const deltaY = (this.anchorRect.top - this.cardRects[idx].top) + (stackIdx * 3);
          const rot = initialRotations[stackIdx % initialRotations.length];
          const scale = 1 - (stackIdx * 0.012);

          card.style.transition = 'none';
          card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px) rotate(${rot}deg) scale(${scale})`;
          card.style.zIndex = (50 - stackIdx).toString();
          card.style.opacity = '1';
          card.classList.remove('is-dealt');

          if (stackIdx === 0) {
            card.classList.add('deck-top-card');
          } else {
            card.classList.remove('deck-top-card');
          }
        }
      });
    };

    requestAnimationFrame(() => {
      calculatePositions();
    });

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    this.resizeHandler = () => {
      if (this.dealtCount < this.totalArticles) {
        calculatePositions();
      }
    };
    window.addEventListener('resize', this.resizeHandler);

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const artId = card.getAttribute('data-id');

        if (idx < this.dealtCount) {
          this.openInsightArticle(artId);
        } else {
          if (!this.isDealing && this.dealtCount < this.totalArticles) {
            this.dealNextCard(cards, initialRotations);
          }
        }
      });
    });

    this.updateHintText();
  }

  dealNextCard(cards, initialRotations) {
    if (this.isDealing || this.dealtCount >= this.totalArticles) return;

    this.isDealing = true;
    const dealIdx = this.dealtCount;
    const activeCard = cards[dealIdx];

    activeCard.classList.remove('deck-top-card');
    activeCard.classList.add('is-dealt');

    activeCard.style.transition = 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms ease, box-shadow 0.4s ease, border-color 0.3s ease';
    activeCard.style.transform = 'translate3d(0px, 0px, 0px) rotate(0deg) scale(1)';
    activeCard.style.zIndex = (20 + dealIdx).toString();

    this.dealtCount++;
    this.updateHintText();

    cards.forEach((card, idx) => {
      if (idx >= this.dealtCount) {
        const stackIdx = idx - this.dealtCount;
        const deltaX = (this.anchorRect.left - this.cardRects[idx].left) + (stackIdx * 4);
        const deltaY = (this.anchorRect.top - this.cardRects[idx].top) + (stackIdx * 3);
        const rot = initialRotations[stackIdx % initialRotations.length];
        const scale = 1 - (stackIdx * 0.012);

        card.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1), z-index 0.3s ease';
        card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px) rotate(${rot}deg) scale(${scale})`;
        card.style.zIndex = (50 - stackIdx).toString();

        if (stackIdx === 0) {
          card.classList.add('deck-top-card');
        } else {
          card.classList.remove('deck-top-card');
        }
      }
    });

    setTimeout(() => {
      this.isDealing = false;

      if (this.dealtCount >= this.totalArticles) {
        setTimeout(() => {
          cards.forEach(c => {
            c.style.transform = '';
            c.style.transition = '';
            c.style.zIndex = '';
          });
        }, 300);
      }
    }, 750);
  }

  updateHintText() {
    const hintEl = document.getElementById('deckDealHint');
    const hintText = document.getElementById('deckHintText');
    if (!hintText || !hintEl) return;

    if (this.dealtCount === 0) {
      hintText.innerHTML = `Click the card deck to deal blogs into grid (<strong>0/${this.totalArticles}</strong> dealt)`;
      hintEl.style.opacity = '1';
    } else if (this.dealtCount < this.totalArticles) {
      hintText.innerHTML = `Click deck to deal next blog (<strong>${this.dealtCount}/${this.totalArticles}</strong> dealt)`;
      hintEl.style.opacity = '1';
    } else {
      hintText.innerHTML = `All <strong>${this.totalArticles} blogs dealt</strong>! Click any card to read full 1000-word article.`;
      setTimeout(() => {
        hintEl.style.opacity = '0.75';
      }, 2000);
    }
  }

  switchView(viewType) {
    this.currentView = viewType;
    const marqueeContainer = document.getElementById('insightsMarqueeContainer');
    const gridContainer = document.getElementById('insightsGridSection');
    const btnMarquee = document.getElementById('btnViewMarquee');
    const btnGrid = document.getElementById('btnViewGrid');

    if (viewType === 'marquee') {
      if (marqueeContainer) marqueeContainer.style.display = 'block';
      if (gridContainer) gridContainer.style.display = 'none';
      if (btnMarquee) btnMarquee.classList.add('active');
      if (btnGrid) btnGrid.classList.remove('active');
    } else {
      if (marqueeContainer) marqueeContainer.style.display = 'none';
      if (gridContainer) gridContainer.style.display = 'block';
      if (btnMarquee) btnMarquee.classList.remove('active');
      if (btnGrid) btnGrid.classList.add('active');
      this.setupLeftDeck();
    }
  }

  /* ---------------------------------------------------- */
  /* 1000-WORD FULL ARTICLE MODAL RENDERER               */
  /* ---------------------------------------------------- */
  openInsightArticle(articleId) {
    const article = NEXORA_DATA.insights.find(a => a.id === articleId);
    if (!article) return;

    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = "NEXORA 1000-Word Deep-Dive Advisory";
    }

    modalBody.innerHTML = `
      <div style="max-width: 860px; margin: 0 auto; background: var(--pure-white); border-radius: var(--radius-lg); border: 1px solid var(--professional-grey); box-shadow: 0 20px 50px rgba(0, 27, 102, 0.12); overflow: hidden;">
        
        <!-- COVER HERO BANNER -->
        <div style="position: relative; height: 320px; width: 100%; overflow: hidden; background: var(--navy);">
          <img src="${article.coverImage}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,27,102,0.3) 0%, rgba(0,27,102,0.85) 100%);"></div>
          
          <div style="position: absolute; bottom: 24px; left: 32px; right: 32px;">
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
              <span class="badge badge-trust" style="background: var(--navy); border: 1px solid var(--sage-green); color: white;">${article.category}</span>
            </div>
            <div style="color: rgba(255,255,255,0.9); font-size: 0.88rem; font-weight: 600;">${article.date} • ${article.readTime} • Comprehensive 1000-Word Report</div>
          </div>
        </div>

        <div style="padding: 40px;">
          <h1 style="font-size: 2.1rem; font-weight: 850; color: var(--navy); margin-bottom: 24px; line-height: 1.3;">${article.title}</h1>
          
          <div style="font-size: 1.05rem; color: var(--navy); font-weight: 600; padding: 20px 24px; background: rgba(0, 90, 43, 0.05); border-left: 4px solid var(--trust-green); border-radius: var(--radius-sm); margin-bottom: 32px; line-height: 1.6;">
            ${article.summary}
          </div>

          <div class="insight-full-body" style="font-size: 1.02rem; color: var(--charcoal); line-height: 1.8;">
            ${article.content}
          </div>

          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--professional-grey); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--navy);">NEXORA Education Intelligence Unit</span>
              <div style="font-size: 0.78rem; color: var(--charcoal-muted);">Verified Advisory & Decision Guidance • 2026 Edition</div>
            </div>
            <button class="btn btn-navy btn-sm" onclick="app.closeModal()">Back to Platform</button>
          </div>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
  }
}

window.InsightsManager = InsightsManager;
