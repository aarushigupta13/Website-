/* NEXORA COMPARISON MANAGER - STICKY TRAY, CONFIRMATION POPUP & TABBED MATRIX */

class CompareManager {
  constructor() {
    this.selectedUniversities = []; // Array of University IDs
    this.selectedProgrammes = [];   // Array of Programme IDs
    this.activeTab = 'universities'; // 'universities' or 'programmes'

    this.trayEl = document.getElementById('compareTray');
    this.trayContainerEl = document.getElementById('compareTrayItems');
    this.trayCountEl = document.getElementById('compareCount');
    
    this.init();
  }

  init() {
    this.updateTrayUI();
  }

  hasItem(id) {
    if (!id) return false;
    return (Array.isArray(this.selectedUniversities) && this.selectedUniversities.includes(id)) ||
           (Array.isArray(this.selectedProgrammes) && this.selectedProgrammes.includes(id));
  }

  /* ---------------------------------------------------- */
  /* COMPARISON SELECTION MANAGEMENT                      */
  /* ---------------------------------------------------- */
  toggleCompare(id) {
    // Legacy helper: autodetect type
    const isUniv = window.app ? (window.app.getUniversityById(id) !== null) : NEXORA_DATA.universities.some(u => u.id === id);
    if (isUniv) {
      this.toggleCompareUniversity(id);
    } else {
      this.toggleCompareProgramme(id);
    }
  }

  toggleCompareUniversity(univId) {
    const univ = window.app ? window.app.getUniversityById(univId) : NEXORA_DATA.universities.find(u => u.id === univId);
    if (!univ) return;

    const index = this.selectedUniversities.indexOf(univId);
    if (index > -1) {
      this.selectedUniversities.splice(index, 1);
    } else {
      const totalCount = this.selectedUniversities.length + this.selectedProgrammes.length;
      if (totalCount >= 3) {
        alert("You can compare up to 3 total items at a time.");
        return;
      }
      this.selectedUniversities.push(univId);
    }

    this.updateTrayUI();
    this.updateCardButtons();
    this.checkSelectionReady();
    this.notifyCompareChanged();
  }

  toggleCompareProgramme(progId) {
    const prog = NEXORA_DATA.programmes.find(p => p.id === progId);
    if (!prog) return;

    const index = this.selectedProgrammes.indexOf(progId);
    if (index > -1) {
      this.selectedProgrammes.splice(index, 1);
    } else {
      const totalCount = this.selectedUniversities.length + this.selectedProgrammes.length;
      if (totalCount >= 3) {
        alert("You can compare up to 3 total items at a time.");
        return;
      }
      this.selectedProgrammes.push(progId);
    }

    this.updateTrayUI();
    this.updateCardButtons();
    this.checkSelectionReady();
    this.notifyCompareChanged();
  }

  removeUniversity(univId) {
    this.selectedUniversities = this.selectedUniversities.filter(id => id !== univId);
    this.updateTrayUI();
    this.updateCardButtons();
    this.notifyCompareChanged();
  }

  removeProgramme(progId) {
    this.selectedProgrammes = this.selectedProgrammes.filter(id => id !== progId);
    this.updateTrayUI();
    this.updateCardButtons();
    this.notifyCompareChanged();
  }

  clearAll() {
    this.selectedUniversities = [];
    this.selectedProgrammes = [];
    this.updateTrayUI();
    this.updateCardButtons();
    this.notifyCompareChanged();
  }

  notifyCompareChanged() {
    if (window.app && typeof window.app.onCompareItemsChanged === 'function') {
      window.app.onCompareItemsChanged();
    }
  }

  /* ---------------------------------------------------- */
  /* CONFIRMATION POPUP TRIGGER                           */
  /* Triggered ONLY when BOTH a university AND a programme */
  /* are selected for comparison                          */
  /* ---------------------------------------------------- */
  checkSelectionReady() {
    if (this.selectedUniversities.length >= 1 && this.selectedProgrammes.length >= 1) {
      setTimeout(() => this.openConfirmationPopup(), 150);
    }
  }

  openConfirmationPopup() {
    const u = NEXORA_DATA.universities.find(x => x.id === this.selectedUniversities[0]);
    const p = NEXORA_DATA.programmes.find(x => x.id === this.selectedProgrammes[0]);
    if (!u || !p) return;

    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = "You're Ready to Compare";
    }

    modalBody.innerHTML = `
      <div class="compare-ready-modal-container" style="text-align: center; padding: 16px 8px;">
        <div style="background: rgba(0,90,43,0.08); color: var(--trust-green); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 14px; border-radius: 20px; display: inline-block; margin-bottom: 14px;">
          SELECTION CONFIRMED
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 850; color: var(--navy); margin-bottom: 8px;">Great, you've selected both a university and a programme!</h2>
        <p style="color: var(--charcoal-muted); font-size: 0.95rem; margin-bottom: 24px;">
          Now let's compare your options side-by-side and see how they match your saved preferences.
        </p>

        <div style="background: var(--soft-white); border: 1px solid var(--border-grey); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: left; max-width: 480px; margin-left: auto; margin-right: auto;">
          <div style="font-weight: 700; color: var(--navy); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 14px; letter-spacing: 0.05em;">Your Selected Options:</div>
          
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-grey);">
            <span style="font-size: 1.4rem;">🏛️</span>
            <div>
              <div style="font-size: 0.75rem; color: var(--charcoal-muted); font-weight: 600;">University:</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--navy);">${u.name}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.4rem;">🎓</span>
            <div>
              <div style="font-size: 0.75rem; color: var(--charcoal-muted); font-weight: 600;">Programme:</div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--navy);">${p.name} <span style="font-size: 0.85rem; color: var(--charcoal-muted); font-weight: 500;">(${p.universityName})</span></div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-lg" onclick="app.compareManager.openCompareModal('spring')">
            Compare Now →
          </button>
          <button class="btn btn-secondary btn-lg" onclick="app.closeModal()">
            Continue Exploring
          </button>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
  }

  /* ---------------------------------------------------- */
  /* STICKY TRAY & CARD BUTTON SYNCHRONIZATION            */
  /* ---------------------------------------------------- */
  updateTrayUI() {
    if (!this.trayEl || !this.trayContainerEl) return;

    const totalCount = this.selectedUniversities.length + this.selectedProgrammes.length;

    if (totalCount > 0) {
      this.trayEl.classList.add('visible');
    } else {
      this.trayEl.classList.remove('visible');
    }

    if (this.trayCountEl) {
      this.trayCountEl.textContent = `${totalCount}/3`;
    }

    let pillsHtml = '';

    this.selectedUniversities.forEach(id => {
      const u = NEXORA_DATA.universities.find(x => x.id === id);
      if (u) {
        pillsHtml += `
          <div class="compare-item-pill">
            <span>🏛️ ${u.shortName.split(' ')[0]}</span>
            <span class="remove-compare-btn" onclick="app.compareManager.removeUniversity('${u.id}')">&times;</span>
          </div>
        `;
      }
    });

    this.selectedProgrammes.forEach(id => {
      const p = NEXORA_DATA.programmes.find(x => x.id === id);
      if (p) {
        pillsHtml += `
          <div class="compare-item-pill">
            <span>🎓 ${p.shortDegree || p.name.split(' ')[0]}</span>
            <span class="remove-compare-btn" onclick="app.compareManager.removeProgramme('${p.id}')">&times;</span>
          </div>
        `;
      }
    });

    this.trayContainerEl.innerHTML = pillsHtml;
  }

  updateCardButtons() {
    const allCompareBtns = document.querySelectorAll('[data-compare-id]');
    allCompareBtns.forEach(btn => {
      const id = btn.getAttribute('data-compare-id');
      const isSelected = this.selectedUniversities.includes(id) || this.selectedProgrammes.includes(id);

      if (isSelected) {
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Added to Compare`;
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        btn.innerHTML = `+ Add to Compare`;
      }
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    this.renderCompareContent();
  }

  /* ---------------------------------------------------- */
  /* TABBED COMPARISON EXPERIENCE (Universities vs Programmes) */
  /* ---------------------------------------------------- */
  openCompareModal(transitionType = 'none') {
    const totalCount = this.selectedUniversities.length + this.selectedProgrammes.length;
    if (totalCount === 0) {
      alert("Please select at least one university or programme to compare.");
      return;
    }

    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = "Side-by-Side Comparison Matrix";
    }

    // Default tab based on selection
    if (this.selectedUniversities.length > 0) {
      this.activeTab = 'universities';
    } else if (this.selectedProgrammes.length > 0) {
      this.activeTab = 'programmes';
    }

    modalBody.innerHTML = `<div id="compareModalContainer" class="${transitionType === 'spring' ? 'compare-entry-spring' : ''}"></div>`;
    this.renderCompareContent();

    backdrop.classList.add('active');
  }

  renderCompareContent() {
    const container = document.getElementById('compareModalContainer');
    if (!container) return;

    // Resolve Wishlist items from app
    const wishlist = (window.app && window.app.wishlist) ? window.app.wishlist : { universities: [], programmes: [] };

    // Resolve Selected Universities & Fallbacks
    let comparedUniversities = this.selectedUniversities
      .map(id => window.app ? window.app.getUniversityById(id) : NEXORA_DATA.universities.find(u => u.id === id))
      .filter(Boolean);

    // If no university directly selected for comparison, pull from wishlisted universities or programme parents
    if (comparedUniversities.length === 0) {
      const wishlistedUnivs = (wishlist.universities || [])
        .map(id => window.app ? window.app.getUniversityById(id) : NEXORA_DATA.universities.find(u => u.id === id))
        .filter(Boolean);
      
      const progUnivs = this.selectedProgrammes
        .map(id => window.app ? window.app.getProgrammeById(id) : NEXORA_DATA.programmes.find(p => p.id === id))
        .filter(Boolean)
        .map(p => window.app ? window.app.getUniversityById(p.universityId) : NEXORA_DATA.universities.find(u => u.id === p.universityId))
        .filter(Boolean);

      const merged = [...wishlistedUnivs, ...progUnivs];
      // Unique universities
      comparedUniversities = merged.filter((u, index, self) => index === self.findIndex(t => t.id === u.id)).slice(0, 3);
    }

    // Fallback if still empty
    if (comparedUniversities.length === 0) {
      comparedUniversities = NEXORA_DATA.universities.slice(0, 3);
    }

    // Resolve Selected Programmes & Fallbacks
    let comparedProgrammes = this.selectedProgrammes
      .map(id => window.app ? window.app.getProgrammeById(id) : NEXORA_DATA.programmes.find(p => p.id === id))
      .filter(Boolean);

    if (comparedProgrammes.length === 0) {
      const wishlistedProgs = (wishlist.programmes || [])
        .map(id => NEXORA_DATA.programmes.find(p => p.id === id))
        .filter(Boolean);

      const univProgs = comparedUniversities.flatMap(u => 
        NEXORA_DATA.programmes.filter(p => p.universityId === u.id)
      );

      const merged = [...wishlistedProgs, ...univProgs];
      comparedProgrammes = merged.filter((p, index, self) => index === self.findIndex(t => t.id === p.id)).slice(0, 3);
    }

    // Build Wishlist & Selection-Aware MATCHES Section
    const wishlistedIds = [...(wishlist.universities || []), ...(wishlist.programmes || [])];
    
    let html = `
      <!-- WISHLIST-AWARE MATCHES SECTION -->
      <div style="background: rgba(0, 90, 43, 0.04); border: 1px solid rgba(0, 90, 43, 0.15); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div>
            <span style="font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--trust-green);">YOUR MATCHES</span>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: var(--navy); margin-top: 2px;">Based on your saved choices & selection</h4>
          </div>
          <div style="font-size: 0.8rem; color: var(--charcoal-muted);">
            Matched against ${wishlistedIds.length} saved wishlist item(s)
          </div>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${comparedUniversities.map(u => {
            const isWishlisted = wishlistedIds.includes(u.id);
            const isSelected = this.selectedUniversities.includes(u.id);
            const matchLabel = isWishlisted ? 'Saved by You' : isSelected ? 'Matches Your Selection' : 'Relevant Partner';

            return `
              <div style="background: #fff; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-grey); display: flex; align-items: center; gap: 10px; font-size: 0.85rem;">
                <span style="font-size: 1rem;">🏛️</span>
                <div>
                  <strong style="color: var(--navy); display: block;">${u.shortName}</strong>
                  <span style="font-size: 0.72rem; color: var(--trust-green); font-weight: 700;">${matchLabel}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- TABS AT TOP OF COMPARISON -->
      <div style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border-grey); padding-bottom: 12px;">
        <button class="btn btn-sm compare-tab ${this.activeTab === 'universities' ? 'btn-primary active' : 'btn-secondary'}" onclick="app.compareManager.switchTab('universities')">
          🏛️ Universities Comparison (${comparedUniversities.length})
        </button>
        <button class="btn btn-sm compare-tab ${this.activeTab === 'programmes' ? 'btn-primary active' : 'btn-secondary'}" onclick="app.compareManager.switchTab('programmes')">
          🎓 Programmes Comparison (${comparedProgrammes.length})
        </button>
      </div>

      <div class="tab-slide-fade">
    `;

    if (this.activeTab === 'universities') {
      /* LEVEL 1: UNIVERSITY COMPARISON TAB */
      html += `
        <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
          <table class="compare-matrix-table" style="width: 100%; border-collapse: collapse; min-width: 650px;">
            <thead>
              <tr>
                <th class="compare-field-label" style="width: 200px;">University Decision Factor</th>
                ${comparedUniversities.map(u => `
                  <th style="min-width: 240px; padding: 14px; background: var(--navy); color: #fff; text-align: left;">
                    <div style="font-size: 0.75rem; color: var(--sage-green); text-transform: uppercase;">${u.location}</div>
                    <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 2px;">${u.name}</div>
                    <div style="margin-top: 6px;">
                      <span class="badge badge-trust">Est. ${u.established}</span>
                    </div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="compare-field-label">Recognition & Approvals</td>
                ${comparedUniversities.map(u => `
                  <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      ${u.approvals.map(a => `<span class="badge badge-trust">${a}</span>`).join('')}
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Delivery Mode</td>
                ${comparedUniversities.map(u => `<td>${u.mode || 'On-Campus & Flexible'}</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Degrees Offered</td>
                ${comparedUniversities.map(u => `<td><strong>${u.totalProgrammes}+ Degrees</strong></td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Fee Range</td>
                ${comparedUniversities.map(u => `
                  <td>
                    <strong style="color: var(--trust-green); font-size: 1rem;">From ${u.startingFee}</strong>
                    <div style="font-size: 0.75rem; color: var(--charcoal-muted);">Semester & Full Payment Options</div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Duration Range</td>
                ${comparedUniversities.map(u => `<td>2 Years (PG) / 3 Years (UG)</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Academic Eligibility</td>
                ${comparedUniversities.map(u => `<td>Graduation in any discipline (50% min) for PG; 10+2 for UG</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Learning Experience & Portal</td>
                ${comparedUniversities.map(u => `
                  <td>
                    <div style="font-size: 0.85rem; color: var(--charcoal-muted);">
                      LMS app, live webinars, recorded archives, proctored exams.
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Career Support</td>
                ${comparedUniversities.map(u => `
                  <td>
                    <div style="font-size: 0.85rem; color: var(--charcoal);">
                      Resume builder, job portal access & placement assistance.
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Student Reviews & Rating</td>
                ${comparedUniversities.map(u => `<td><strong style="color: var(--navy);">★ ${u.rating} / 5.0</strong> (${u.reviewCount} evaluations)</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Actions</td>
                ${comparedUniversities.map(u => `
                  <td>
                    <button class="btn btn-navy btn-sm" style="width: 100%; margin-bottom: 6px;" onclick="app.closeModal(); app.navigateToUniversity('${u.id}')">
                      View University Page
                    </button>
                    <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="app.openInfoRequestModal('${u.name}', 'University Packet')">
                      Get Info Packet
                    </button>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      /* LEVEL 2: PROGRAMME COMPARISON TAB WITH PARENT UNIVERSITY RELATIONSHIPS */
      html += `
        <!-- PARENT UNIVERSITY TO PROGRAMMES RELATIONSHIP BREAKDOWN -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--navy); margin-bottom: 10px;">
            Programmes Offered Under Compared Universities:
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
            ${comparedUniversities.map(u => {
              const uProgs = NEXORA_DATA.programmes.filter(p => p.universityId === u.id);
              return `
                <div style="background: var(--soft-white); border: 1px solid var(--border-grey); border-radius: 8px; padding: 12px;">
                  <strong style="color: var(--navy); font-size: 0.9rem; display: block; margin-bottom: 6px;">🏛️ ${u.shortName}</strong>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${uProgs.map(p => `
                      <span style="font-size: 0.8rem; color: var(--charcoal-muted); cursor: pointer;" onclick="app.navigateToProgramme('${p.id}')">
                        • ${p.name}
                      </span>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
          <table class="compare-matrix-table" style="width: 100%; border-collapse: collapse; min-width: 650px;">
            <thead>
              <tr>
                <th class="compare-field-label" style="width: 200px;">Programme Parameter</th>
                ${comparedProgrammes.map(p => `
                  <th style="min-width: 240px; padding: 14px; background: var(--navy); color: #fff; text-align: left;">
                    <div style="font-size: 0.75rem; color: var(--sage-green); text-transform: uppercase;">${p.universityName}</div>
                    <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 2px;">${p.name}</div>
                    <div style="margin-top: 6px;">
                      <span class="badge badge-trust">${p.totalFee} Total</span>
                    </div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="compare-field-label">Parent University</td>
                ${comparedProgrammes.map(p => `<td><strong>${p.universityName}</strong></td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Level & Duration</td>
                ${comparedProgrammes.map(p => `<td>${p.level} Degree | ${p.duration}</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Fee Breakdown</td>
                ${comparedProgrammes.map(p => `
                  <td class="compare-val-highlight">
                    <strong>${p.totalFee}</strong>
                    <div style="font-size: 0.75rem; color: var(--charcoal-muted);">${p.semesterFee}</div>
                    <div style="font-size: 0.75rem; color: var(--trust-green); margin-top: 2px;">EMI Options: ${p.emiAvailable ? 'Available' : 'N/A'}</div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Academic Eligibility</td>
                ${comparedProgrammes.map(p => `<td>${p.eligibility}</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Delivery Mode</td>
                ${comparedProgrammes.map(p => `<td>${(p.mode && p.mode.includes('Offline')) ? 'On-Campus Lectures & Labs' : (p.mode || 'Online') + ' with Proctored Exams'}</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Available Specialisations</td>
                ${comparedProgrammes.map(p => `
                  <td>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                      ${p.specialisations.map(s => `<span class="badge badge-grey">${s}</span>`).join('')}
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Career Outcomes</td>
                ${comparedProgrammes.map(p => `
                  <td>
                    <div style="font-size: 0.85rem; color: var(--charcoal);">
                      Prepares for leadership and analytical roles in ${p.specialisations[0] || 'management'}.
                    </div>
                  </td>
                `).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Student Rating</td>
                ${comparedProgrammes.map(p => `<td><strong style="color: var(--navy);">★ ${p.rating} / 5.0</strong> (${p.reviewCount} reviews)</td>`).join('')}
              </tr>
              <tr>
                <td class="compare-field-label">Actions</td>
                ${comparedProgrammes.map(p => `
                  <td>
                    <button class="btn btn-navy btn-sm" style="width: 100%; margin-bottom: 6px;" onclick="app.closeModal(); app.navigateToProgramme('${p.id}')">
                      View Programme Page
                    </button>
                    <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="app.openInfoRequestModal('${p.name}', 'Programme Packet')">
                      Get Info Packet
                    </button>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;
  }
}

window.CompareManager = CompareManager;
