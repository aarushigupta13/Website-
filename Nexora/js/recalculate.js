/* "RECALCULATE YOUR ROUTE" INTERACTIVE STATE MANAGER */

class RouteRecalculator {
  constructor() {
    this.currentDestinationKey = 'c-mkt-1'; // Default: Digital Marketing Manager
    this.selectEl = document.getElementById('recalculateSelect');
    this.resultsContainerEl = document.getElementById('recalculateResults');
    this.recalculateBtn = document.getElementById('recalculateBtn');

    this.init();
  }

  init() {
    if (!this.selectEl || !this.recalculateBtn) return;

    this.populateOptions();
    
    this.recalculateBtn.addEventListener('click', () => {
      this.triggerRecalculation();
    });

    this.selectEl.addEventListener('change', () => {
      this.triggerRecalculation();
    });

    // Render initial recalculate view
    this.renderResults(this.selectEl.value);
  }

  populateOptions() {
    let optionsHtml = '';
    
    Object.keys(NEXORA_DATA.directions).forEach(dirKey => {
      const dir = NEXORA_DATA.directions[dirKey];
      optionsHtml += `<optgroup label="${dir.name}">`;
      dir.destinations.forEach(dest => {
        optionsHtml += `<option value="${dest.id}">${dest.title} (${dest.demand})</option>`;
      });
      optionsHtml += `</optgroup>`;
    });

    this.selectEl.innerHTML = optionsHtml;
  }

  triggerRecalculation() {
    const selectedId = this.selectEl.value;

    // Visual feedback: Spin icon and add pulse class
    if (this.recalculateBtn) {
      this.recalculateBtn.classList.add('loading');
      this.recalculateBtn.disabled = true;
      this.recalculateBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin-icon"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        Mapping Pathway...
      `;
    }

    if (this.resultsContainerEl) {
      this.resultsContainerEl.style.opacity = '0.4';
    }

    // Simulate 400ms intelligent route calculation delay
    setTimeout(() => {
      this.renderResults(selectedId);

      if (window.app && typeof window.app.autoMapPipeline === 'function') {
        window.app.autoMapPipeline(selectedId, true);
      }

      if (this.resultsContainerEl) {
        this.resultsContainerEl.style.opacity = '1';
      }

      if (this.recalculateBtn) {
        this.recalculateBtn.classList.remove('loading');
        this.recalculateBtn.disabled = false;
        this.recalculateBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          Generate Career Path
        `;
      }
    }, 400);
  }

  renderResults(destId) {
    if (!this.resultsContainerEl) return;

    // Find parent direction for destId
    let foundDir = null;
    let foundDest = null;

    Object.keys(NEXORA_DATA.directions).forEach(dirKey => {
      const dir = NEXORA_DATA.directions[dirKey];
      const match = dir.destinations.find(d => d.id === destId);
      if (match) {
        foundDir = dir;
        foundDest = match;
      }
    });

    if (!foundDir || !foundDest) return;

    const matchingProgs = foundDir.programmeIds.map(id => 
      NEXORA_DATA.programmes.find(p => p.id === id)
    ).filter(Boolean);

    this.resultsContainerEl.innerHTML = `
      <div style="padding-top: 20px; border-top: 1px solid var(--grey-light);">
        <div class="journey-indicator" style="margin-bottom: 20px;">
          <span style="color: var(--navy); font-weight: 700;">CAREER PATHWAY STATUS:</span>
          <span class="journey-step">Start</span>
          <span class="journey-separator">→</span>
          <span class="journey-step active">${foundDest.title}</span>
          <span class="journey-separator">→</span>
          <span class="journey-step">${foundDir.skills.length} Skills Required</span>
          <span class="journey-separator">→</span>
          <span class="journey-step">${matchingProgs.length} Programmes</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          <!-- RECALCULATED SKILLS -->
          <div style="background: var(--soft-white); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--professional-grey);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--navy); text-transform: uppercase; margin-bottom: 8px;">Target Skill Prerequisites</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${foundDir.skills.map(s => `<span class="badge badge-sage">${s}</span>`).join('')}
            </div>
          </div>

          <!-- RECALCULATED DEGREE PATHS -->
          <div style="background: var(--soft-white); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--professional-grey);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--navy); text-transform: uppercase; margin-bottom: 8px;">Recommended Degree Pathways</div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${foundDir.degrees.map(deg => `<span class="badge badge-trust">${deg}</span>`).join('')}
            </div>
          </div>

          <!-- RECALCULATED SALARY & DEMAND -->
          <div style="background: var(--soft-white); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--professional-grey);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--navy); text-transform: uppercase; margin-bottom: 8px;">Industry Insights</div>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--navy);">${foundDest.avgSalary}</div>
            <div style="font-size: 0.8rem; color: var(--sage-green); margin-top: 4px;">Demand: ${foundDest.demand}</div>
          </div>
        </div>

        <div style="margin-top: 20px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 0.85rem; color: var(--charcoal-muted);">Roadmap generated to match your target career role.</span>
          <button class="btn btn-navy btn-sm" onclick="app.openRouteModal('${foundDir.id}')">
            View Full Pathway Breakdown
          </button>
        </div>
      </div>
    `;
  }
}

window.RouteRecalculator = RouteRecalculator;
