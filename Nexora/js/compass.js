/* DEGREECOMPASS INTERACTIVE ENGINE & ROTATION ROUTINE */

class DegreeCompassEngine {
  constructor() {
    this.selectedDirectionKey = 'MARKETING'; // Default initial active direction
    this.containerEl = document.getElementById('compassContainer');
    this.needleEl = document.getElementById('compassNeedleContainer');
    this.hubTitleEl = document.getElementById('compassHubTitle');
    this.routePanelEl = document.getElementById('compassRoutePanel');
    
    this.init();
  }

  init() {
    if (!this.containerEl) return;
    this.renderCompassNodes();
    this.selectDirection(this.selectedDirectionKey);
  }

  renderCompassNodes() {
    const angleToPosMap = { 0: 0, 45: 1, 90: 2, 135: 3, 180: 4, 225: 5, 270: 6, 315: 7 };
    const cardinals = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
    const dropdownAlignMap = {
      0: 'dropdown-align-center dropdown-open-down',
      1: 'dropdown-align-right dropdown-open-down',
      2: 'dropdown-align-right dropdown-open-down',
      3: 'dropdown-align-right dropdown-open-up',
      4: 'dropdown-align-center dropdown-open-up',
      5: 'dropdown-align-left dropdown-open-up',
      6: 'dropdown-align-left dropdown-open-down',
      7: 'dropdown-align-left dropdown-open-down'
    };

    // Filter strictly to the 8 principal compass rose directions (0° to 315°)
    const keys = Object.keys(NEXORA_DATA.directions).filter(key => {
      const dirData = NEXORA_DATA.directions[key];
      return dirData && angleToPosMap[dirData.angle] !== undefined;
    });
    this.compassKeys = keys;

    keys.forEach((key) => {
      const dirData = NEXORA_DATA.directions[key];
      const posIndex = angleToPosMap[dirData.angle];
      const alignClass = dropdownAlignMap[posIndex] || 'dropdown-align-center dropdown-open-down';
      const cardinal = cardinals[dirData.angle] || '';

      const wrapper = document.createElement('div');
      wrapper.className = `direction-node-wrapper dir-pos-${posIndex}`;
      wrapper.setAttribute('data-direction', key);

      wrapper.innerHTML = `
        <button class="direction-node" data-direction="${key}" type="button" aria-expanded="false" title="${key} - ${dirData.name}">
          <span>${key}</span>
          <svg class="node-dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <div class="direction-dropdown-menu ${alignClass}" id="dropdown-${key}">
          <div class="dropdown-header">
            <span class="dropdown-header-badge">CAREER TRACK</span>
            <span class="dropdown-header-title">${dirData.name}</span>
          </div>

          <div class="dropdown-dest-label">CAREER DESTINATIONS</div>
          <div class="dropdown-dest-list">
            ${dirData.destinations.map(d => `
              <div class="dropdown-dest-item" data-key="${key}" title="View route for ${d.title}">
                <div class="dest-info">
                  <div class="dest-item-name">${d.title}</div>
                  <span class="badge badge-trust dropdown-dest-badge" style="font-size: 0.6rem; padding: 2px 6px; width: fit-content;">${d.demand}</span>
                </div>
                <div class="dest-item-salary">${d.avgSalary}</div>
              </div>
            `).join('')}
          </div>

          <div class="dropdown-footer">
            <button class="dropdown-action-btn" type="button" data-key="${key}">
              <span>View Degree Routes</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;

      const btn = wrapper.querySelector('.direction-node');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectDirection(key);
        this.toggleDropdown(wrapper, btn);
      });

      btn.addEventListener('mouseenter', () => {
        this.previewDirection(key);
      });

      // Destination item clicks inside dropdown
      const destItems = wrapper.querySelectorAll('.dropdown-dest-item');
      destItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectDirection(key);
          if (window.app && typeof window.app.openRouteModal === 'function') {
            window.app.openRouteModal(key);
          }
        });
      });

      // Action button inside dropdown
      const actionBtn = wrapper.querySelector('.dropdown-action-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectDirection(key);
          if (window.app && typeof window.app.openRouteModal === 'function') {
            window.app.openRouteModal(key);
          }
        });
      }

      this.containerEl.appendChild(wrapper);
    });

    // Close all open dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.direction-node-wrapper')) {
        this.closeAllDropdowns();
      }
    });

    // Make center hub clickable to toggle random or reset
    const centerHub = document.getElementById('compassCenterHub');
    if (centerHub) {
      centerHub.addEventListener('click', () => {
        const allKeys = this.compassKeys && this.compassKeys.length ? this.compassKeys : Object.keys(NEXORA_DATA.directions);
        const nextKey = allKeys[(allKeys.indexOf(this.selectedDirectionKey) + 1) % allKeys.length];
        this.selectDirection(nextKey);
        this.closeAllDropdowns();
      });
    }
  }

  toggleDropdown(wrapper, btn) {
    const isOpen = wrapper.classList.contains('dropdown-open');
    this.closeAllDropdowns();
    if (!isOpen) {
      wrapper.classList.add('dropdown-open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  closeAllDropdowns() {
    if (!this.containerEl) return;
    const allWrappers = this.containerEl.querySelectorAll('.direction-node-wrapper');
    allWrappers.forEach(w => {
      w.classList.remove('dropdown-open');
      const b = w.querySelector('.direction-node');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  selectDirection(dirKey) {
    if (!NEXORA_DATA.directions[dirKey]) return;
    this.selectedDirectionKey = dirKey;
    const dirData = NEXORA_DATA.directions[dirKey];

    // 1. Rotate Compass Needle Pointer to match direction angle
    if (this.needleEl) {
      this.needleEl.style.transform = `rotate(${dirData.angle}deg)`;
    }

    if (dirData.destinations && dirData.destinations[0] && window.app && typeof window.app.autoMapPipeline === 'function') {
      window.app.autoMapPipeline(dirData.destinations[0].id, false);
    }

    // 2. Update active direction spoke ray line
    const allSpokes = this.containerEl.querySelectorAll('.compass-spoke');
    allSpokes.forEach(spoke => {
      if (parseInt(spoke.getAttribute('data-deg')) === dirData.angle) {
        spoke.classList.add('active');
      } else {
        spoke.classList.remove('active');
      }
    });

    // 3. Update active direction button styling
    const allNodes = this.containerEl.querySelectorAll('.direction-node');
    allNodes.forEach(node => {
      if (node.getAttribute('data-direction') === dirKey) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // 4. Update Center Hub Text
    if (this.hubTitleEl) {
      this.hubTitleEl.textContent = dirKey;
    }

    // 5. Update Revealed Route Panel in Hero
    this.updateRoutePanel(dirData);
  }

  previewDirection(dirKey) {
    // Subtle preview needle movement & spoke highlight on hover
    const dirData = NEXORA_DATA.directions[dirKey];
    if (dirData && this.needleEl) {
      this.needleEl.style.transform = `rotate(${dirData.angle}deg)`;
    }
    const allSpokes = this.containerEl.querySelectorAll('.compass-spoke');
    allSpokes.forEach(spoke => {
      if (parseInt(spoke.getAttribute('data-deg')) === dirData.angle) {
        spoke.classList.add('active');
      } else {
        spoke.classList.remove('active');
      }
    });
  }

  updateRoutePanel(dirData) {
    if (!this.routePanelEl) return;

    this.routePanelEl.style.animation = 'none';
    void this.routePanelEl.offsetHeight; // Trigger DOM reflow
    this.routePanelEl.style.animation = 'panelSlideFade 0.28s ease-out';

    const topDest = dirData.destinations[0];
    const matchingProgs = dirData.programmeIds.map(id => 
      NEXORA_DATA.programmes.find(p => p.id === id)
    ).filter(Boolean);

    const matchingUnivs = dirData.universityIds.map(id =>
      NEXORA_DATA.universities.find(u => u.id === id)
    ).filter(Boolean);

    this.routePanelEl.innerHTML = `
      <div class="compass-route-header">
        <div class="compass-route-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005A2B" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/></svg>
          <strong>ACTIVE ROUTE:</strong> <span style="color: var(--trust-green); font-weight: 800;">${dirData.name}</span>
        </div>
        <div class="badge badge-trust">Intelligent Navigation Route</div>
      </div>

      <div class="compass-route-flow">
        <!-- WAYPOINT 1: CAREER DESTINATION -->
        <div class="route-step-card">
          <div class="route-step-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Destination
          </div>
          <div class="route-step-content">
            ${dirData.destinations.map(d => `<span class="route-tag highlight">${d.title}</span>`).join('')}
          </div>
        </div>

        <!-- WAYPOINT 2: SKILLS -->
        <div class="route-step-card">
          <div class="route-step-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Required Skills
          </div>
          <div class="route-step-content">
            ${dirData.skills.map(s => `<span class="route-tag">${s}</span>`).join('')}
          </div>
        </div>

        <!-- WAYPOINT 3: DEGREES -->
        <div class="route-step-card">
          <div class="route-step-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Degree Paths
          </div>
          <div class="route-step-content">
            ${dirData.degrees.map(deg => `<span class="route-tag highlight">${deg}</span>`).join('')}
          </div>
        </div>

        <!-- WAYPOINT 4 & 5: PROGRAMMES & UNIVERSITIES -->
        <div class="route-step-card">
          <div class="route-step-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/></svg>
            Top Universities
          </div>
          <div class="route-step-content">
            ${matchingUnivs.map(u => `<span class="route-tag">${u.shortName}</span>`).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" onclick="app.openRouteModal('${dirData.id}')">
          Explore This Route
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }
}

// Global reference
window.DegreeCompassEngine = DegreeCompassEngine;
