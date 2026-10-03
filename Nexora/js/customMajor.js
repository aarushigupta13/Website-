/* NEXORA "CAN'T FIND YOUR MAJOR?" CUSTOM NAVIGATION ENGINE */

class CustomMajorNavigator {
  constructor() {
    this.containerEl = document.getElementById('customMajorContainer');
    this.inputEl = document.getElementById('customMajorInput');
    this.searchBtn = document.getElementById('customMajorSearchBtn');
    this.resultsEl = document.getElementById('customMajorResults');
    this.pills = document.querySelectorAll('.major-pill');

    this.curatedMajors = {
      "psychology": {
        title: "Psychology & Behavioral Science",
        category: "Humanities & Health Sciences",
        degrees: ["B.A. in Psychology", "M.Sc in Applied Psychology", "PG Diploma in Counseling & Guidance"],
        skills: ["Clinical Assessment", "Behavioral Analysis", "Counseling Methodologies", "Cognitive Research", "Statistical Data Analysis"],
        careers: [
          { title: "Organizational Psychologist", salary: "₹10 - ₹22 LPA", demand: "High Growth" },
          { title: "Clinical Counselor", salary: "₹7 - ₹15 LPA", demand: "Top Priority" },
          { title: "Behavioral Data Analyst", salary: "₹9 - ₹18 LPA", demand: "Emerging" }
        ],
        universities: ["Amity Online", "Jain Online", "IGNOU"],
        description: "Explore the human mind, cognitive behavior, and mental wellness with UGC-approved online and hybrid degree pathways."
      },
      "cyber law": {
        title: "Cyber Law & Digital Jurisprudence",
        category: "Legal & Regulatory Studies",
        degrees: ["B.A. LL.B / BBA LL.B", "Online LL.M in Cyber Law & IPR", "PG Diploma in Cyber Forensics & Law"],
        skills: ["IT Act & Indian Cyber Law", "Data Privacy & GDPR", "Digital Forensics Protocol", "IPR & Patent Filing", "Smart Contract Law"],
        careers: [
          { title: "Cyber Legal Counsel", salary: "₹12 - ₹25 LPA", demand: "Critical" },
          { title: "Data Protection Officer (DPO)", salary: "₹15 - ₹32 LPA", demand: "Top Priority" },
          { title: "Compliance & Risk Specialist", salary: "₹9 - ₹20 LPA", demand: "High Growth" }
        ],
        universities: ["Amity Online", "Manipal Online", "NLU Distance Programmes"],
        description: "Bridge law and technology with specialized master's and diploma paths in cyber crimes, data privacy, and digital compliance."
      },
      "biotechnology": {
        title: "Biotechnology & Life Sciences",
        category: "Applied Sciences & Health Tech",
        degrees: ["B.Sc in Biotechnology", "M.Sc in Bioinformatics & Genomics", "PG Diploma in Clinical Research"],
        skills: ["Molecular Biology", "Bioinformatics & Python", "Clinical Trial Protocol", "Bioprocess Engineering", "Genomic Data Analytics"],
        careers: [
          { title: "Bioinformatics Specialist", salary: "₹10 - ₹24 LPA", demand: "High Growth" },
          { title: "Clinical Research Associate", salary: "₹7 - ₹16 LPA", demand: "Steady" },
          { title: "Biotech Process Scientist", salary: "₹9 - ₹20 LPA", demand: "High Demand" }
        ],
        universities: ["BITS Pilani WILP", "Amity Online", "Manipal Online"],
        description: "Navigate modern biotech careers across clinical research, pharmaceuticals, and genetic data modeling."
      },
      "artificial intelligence": {
        title: "AI, Robotics & Automation",
        category: "Advanced Technology & Engineering",
        degrees: ["BCA in AI & Robotics", "Online MCA in Machine Learning", "M.Tech in Automation Systems"],
        skills: ["ROS (Robot Operating System)", "Deep Learning & PyTorch", "Computer Vision", "Sensor Fusion", "Reinforcement Learning"],
        careers: [
          { title: "Robotics Software Engineer", salary: "₹14 - ₹30 LPA", demand: "Critical" },
          { title: "AI Automation Architect", salary: "₹18 - ₹38 LPA", demand: "Top Tier" },
          { title: "Autonomous Systems Lead", salary: "₹16 - ₹34 LPA", demand: "High Growth" }
        ],
        universities: ["BITS Pilani WILP", "Jain Online", "Manipal Online"],
        description: "Pioneer cutting-edge robotics, neural network automation, and intelligent embedded systems."
      },
      "hospitality": {
        title: "Hospitality & Luxury Management",
        category: "Services & International Business",
        degrees: ["BBA in Hospitality Operations", "Online MBA in Luxury Brand Management", "M.Sc in Tourism & Event Systems"],
        skills: ["Revenue Optimization", "Luxury Customer Experience", "Global Tourism Logistics", "Event & Convention Mgmt", "Cross-Cultural Leadership"],
        careers: [
          { title: "Hotel Operations Director", salary: "₹10 - ₹22 LPA", demand: "High Growth" },
          { title: "Luxury Brand Manager", salary: "₹12 - ₹26 LPA", demand: "Elite Track" },
          { title: "Global Tourism Strategist", salary: "₹8 - ₹18 LPA", demand: "Steady" }
        ],
        universities: ["Amity Online", "Jain Online", "Chandigarh University Online"],
        description: "Specialize in five-star hospitality, luxury retail experiences, and worldwide travel management."
      },
      "sustainability": {
        title: "Environmental Science & Sustainability",
        category: "Ecology & Corporate Governance",
        degrees: ["B.Sc Environmental Science", "MBA in Sustainability & ESG Management", "M.Sc Green Energy Policy"],
        skills: ["ESG Auditing & Reporting", "Carbon Accounting", "Renewable Energy Strategy", "Waste Management Policy", "Circular Economy Modeling"],
        careers: [
          { title: "ESG & Sustainability Lead", salary: "₹12 - ₹28 LPA", demand: "High Growth" },
          { title: "Corporate Environmental Officer", salary: "₹9 - ₹19 LPA", demand: "Top Priority" },
          { title: "Green Energy Analyst", salary: "₹8 - ₹17 LPA", demand: "Emerging" }
        ],
        universities: ["Amity Online", "TERI University Online", "IGNOU"],
        description: "Lead corporate sustainability, climate risk analysis, and clean energy transition across industries."
      }
    };

    this.init();
  }

  init() {
    if (!this.inputEl || !this.searchBtn || !this.resultsEl) return;

    // Search button click
    this.searchBtn.addEventListener('click', () => {
      this.handleSearch();
    });

    // Enter key in input
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSearch();
      }
    });

    // Popular tag pills
    this.pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-major');
        this.inputEl.value = query;
        this.handleSearch(query);
      });
    });
  }

  handleSearch(overrideQuery) {
    const rawQuery = (overrideQuery || this.inputEl.value).trim();
    if (!rawQuery) {
      this.inputEl.focus();
      return;
    }

    const queryKey = rawQuery.toLowerCase();
    let match = null;

    // Check curated database
    for (const key of Object.keys(this.curatedMajors)) {
      if (queryKey.includes(key) || key.includes(queryKey)) {
        match = this.curatedMajors[key];
        break;
      }
    }

    // If not curated, generate dynamic intelligent roadmap
    if (!match) {
      match = this.generateDynamicRoadmap(rawQuery);
    }

    this.renderCustomResult(match, rawQuery);
  }

  generateDynamicRoadmap(query) {
    const cleanTitle = query.charAt(0).toUpperCase() + query.slice(1);
    return {
      title: `${cleanTitle} Pathway`,
      category: "Specialized & Emerging Field",
      degrees: [
        `Bachelor's (B.A. / B.Sc / BBA) in ${cleanTitle}`,
        `Master's / MBA in ${cleanTitle} & Applied Management`,
        `Executive PG Diploma in ${cleanTitle} Specialization`
      ],
      skills: [
        `${cleanTitle} Core Fundamentals`,
        "Analytical Problem Solving",
        "Industry Technology Tools",
        "Strategic Domain Research",
        "Project & Systems Management"
      ],
      careers: [
        { title: `${cleanTitle} Consultant`, salary: "₹8 - ₹18 LPA", demand: "High Demand" },
        { title: `${cleanTitle} Strategy Lead`, salary: "₹12 - ₹25 LPA", demand: "Growing" },
        { title: `${cleanTitle} Specialist`, salary: "₹7 - ₹15 LPA", demand: "Specialized" }
      ],
      universities: ["Amity University Online", "Jain University Online", "Manipal University Online"],
      description: `Tailored educational route and verified UGC-recognized university pathways for students pursuing ${cleanTitle}.`
    };
  }

  renderCustomResult(data, query) {
    const backdrop = document.getElementById('globalModalBackdrop');
    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = `${data.title} - Custom Navigation Route`;
    }

    // Keep inline results hidden so the hero card alignment remains completely intact
    if (this.resultsEl) {
      this.resultsEl.style.display = 'none';
      this.resultsEl.innerHTML = '';
    }

    modalBody.innerHTML = `
      <div class="custom-result-header-modal" style="margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
          <span class="badge badge-trust" style="font-size: 0.75rem; padding: 4px 10px;">CUSTOM ROUTE FOUND</span>
          <span class="custom-category-tag" style="font-size: 0.8rem; font-weight: 700; color: var(--sage-green);">${data.category}</span>
        </div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--navy); line-height: 1.25; margin-bottom: 8px;">${data.title}</h2>
        <p style="font-size: 0.95rem; color: var(--charcoal-muted); line-height: 1.5;">${data.description}</p>
      </div>

      <div class="custom-result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <!-- WAYPOINT 1: DEGREE OPTIONS -->
        <div style="background: var(--soft-white); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--professional-grey);">
          <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--navy); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; letter-spacing: 0.04em;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            Recommended Degrees
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${data.degrees.map(deg => `<div style="background: var(--pure-white); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--professional-grey); font-weight: 700; color: var(--navy); font-size: 0.85rem;">${deg}</div>`).join('')}
          </div>
        </div>

        <!-- WAYPOINT 2: CORE SKILLS -->
        <div style="background: var(--soft-white); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--professional-grey);">
          <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--navy); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; letter-spacing: 0.04em;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Key Prerequisite Skills
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${data.skills.map(s => `<span class="badge badge-sage" style="font-size: 0.8rem; padding: 4px 10px;">${s}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- TARGET CAREER OUTCOMES -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--navy); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; letter-spacing: 0.04em;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          Target Career Roles & Salary Benchmarks
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
          ${data.careers.map(c => `
            <div style="background: var(--pure-white); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--professional-grey); border-left: 4px solid var(--trust-green);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; gap: 8px;">
                <span style="font-weight: 750; color: var(--navy); font-size: 0.88rem;">${c.title}</span>
                <span class="badge badge-trust" style="font-size: 0.65rem; padding: 2px 6px;">${c.demand}</span>
              </div>
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--trust-green);">${c.salary}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- MATCHING ACCREDITED UNIVERSITIES -->
      <div style="margin-bottom: 28px; background: var(--soft-white); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--professional-grey);">
        <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--navy); display: flex; align-items: center; gap: 6px; margin-bottom: 10px; letter-spacing: 0.04em;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/></svg>
          Recognized Universities Offering This Field
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.universities.map(u => `<span class="badge badge-navy" style="font-size: 0.85rem; padding: 6px 12px;">${u}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-primary btn-sm" type="button" onclick="if(window.app){window.app.closeModal(); window.app.scrollToSection('programmes');}">
          Explore Accredited Programmes →
        </button>
        <button class="btn btn-secondary btn-sm" type="button" onclick="if(window.app){window.app.closeModal(); window.app.scrollToSection('universities');}">
          Browse Verified Universities
        </button>
      </div>
    `;

    backdrop.classList.add('active');
  }
}

// Global initialization
window.CustomMajorNavigator = CustomMajorNavigator;
