/* NEXORA VIEW RENDERERS FOR UNIVERSITIES, PROGRAMMES & CAREER PATHWAY PAGES */

class ViewRenderers {
  constructor() {}

  /* ---------------------------------------------------- */
  /* PAGE 2 — FULL DEDICATED UNIVERSITY PAGE RENDERER     */
  /* ---------------------------------------------------- */
  renderFullUniversityPage(univId, container) {
    const univ = window.app ? window.app.getUniversityById(univId) : NEXORA_DATA.universities.find(u => u.id === univId);
    if (!univ || !container) return;

    const univProgrammes = window.app ? window.app.getProgrammesForUniversity(univ.id) : NEXORA_DATA.programmes.filter(p => p.universityId === univ.id);
    const similarUniversities = NEXORA_DATA.universities.filter(u => u.id !== univ.id).slice(0, 3);
    const isSaved = window.app ? window.app.isWishlisted(univ.id, 'university') : false;

    const defaultGallery = [
      univ.image || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80"
    ];

    const gallery = [
      (univ.gallery && univ.gallery[0]) || univ.image || defaultGallery[0],
      (univ.gallery && univ.gallery[1]) || defaultGallery[1],
      (univ.gallery && univ.gallery[2]) || defaultGallery[2],
      (univ.gallery && univ.gallery[3]) || defaultGallery[3]
    ];

    container.innerHTML = `
      <!-- TOP BREADCRUMB & BACK BAR -->
      <div class="page-view-header">
        <div class="container" style="max-width: 1280px;">
          <div class="page-breadcrumb-nav">
            <button class="back-link-btn" onclick="app.navigateToUniversitiesPage()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Back to Universities</span>
            </button>
            <div class="breadcrumb-trail">
              <span class="crumb" onclick="app.navigateToHome()">Home</span>
              <span class="crumb-sep">/</span>
              <span class="crumb" onclick="app.navigateToUniversitiesPage()">Universities</span>
              <span class="crumb-sep">/</span>
              <span class="crumb active">${univ.shortName || univ.name}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN PAGE WRAPPER (CENTERED & PROPORTIONED) -->
      <div class="container" style="max-width: 1280px; padding-top: 24px; padding-bottom: 60px;">

        <!-- 1. HIGH-IMPACT CAMPUS HERO BANNER -->
        <div class="university-page-hero-banner">
          <img src="${univ.image}" alt="${univ.name} Campus" class="hero-banner-bg-img" onerror="this.src='${defaultGallery[0]}'" />
          <div class="hero-banner-overlay">
            <div class="univ-hero-top-row">
              <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap; flex: 1; min-width: 280px;">
                <div class="univ-hero-logo-box-fixed">
                  <img src="${univ.logo}" alt="${univ.name} Logo" class="univ-hero-logo-fixed" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                  <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-weight:850; font-size:1.1rem; color:var(--navy); text-align:center;">${(univ.shortName || univ.name).substring(0, 3)}</div>
                </div>
                <div style="flex: 1; min-width: 240px;">
                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                    ${univ.approvals ? univ.approvals.map(a => `<span class="badge badge-trust" style="background: rgba(255,255,255,0.2); color: #fff; border-color: rgba(255,255,255,0.3); font-weight: 750;">${a}</span>`).join('') : ''}
                    <span class="badge badge-sage">🛡️ ${(univ.mode && univ.mode.toLowerCase().includes('offline')) ? 'UGC & AICTE Approved' : 'UGC-DEB Entitled'}</span>
                  </div>
                  <h1 class="univ-hero-title-main">${univ.name}</h1>
                  <div class="univ-hero-meta-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <span>📍 ${univ.location}</span>
                    <span>•</span>
                    <span>🎓 ${(univProgrammes ? univProgrammes.length : univ.totalProgrammes || 1)}+ Verified Degree Programmes</span>
                    <span>•</span>
                    <span>⭐ ★ ${univ.rating || '4.8'} (${univ.reviewCount || '150+'} Student Reviews)</span>
                  </div>
                </div>
              </div>

              <div class="univ-hero-actions">
                <button class="btn btn-primary btn-md" onclick="app.openInfoRequestModal('${univ.name}', 'University Admission Packet')" style="font-weight: 800; border-radius: 50px; padding: 12px 24px;">
                  Get Info Packet
                </button>
                <button class="btn btn-secondary btn-md" data-compare-id="${univ.id}" onclick="app.compareManager.toggleCompareUniversity('${univ.id}')" style="font-weight: 750; border-radius: 50px; padding: 12px 20px;">
                  + Compare
                </button>
                <button class="btn btn-outline-navy btn-md shortlist-toggle-btn ${isSaved ? 'saved' : ''}" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.4); border-radius: 50px; padding: 12px 20px;" onclick="app.toggleWishlist('${univ.id}', 'university')">
                  <span>${isSaved ? '♥ Saved' : '♡ Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SOURCE TRANSPARENCY BANNER (FOR DISCOVERED UNIVERSITIES) -->
        ${univ.sourceType === 'external' ? `
          <div style="background: #F0F7FF; border: 1.5px solid #BAE0FF; border-radius: 14px; padding: 14px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; color: #004085;">
              <span style="font-size: 1.3rem;">🌐</span>
              <div>
                <strong>Source Transparency:</strong> ${univ.transparencyNote || 'Information retrieved from verified external education sources.'} (${univ.sourceName || 'Official Regulatory Portal'})
              </div>
            </div>
            ${univ.sourceUrl ? `<a href="${univ.sourceUrl}" target="_blank" rel="noopener" class="btn btn-xs btn-outline-navy" style="border-radius: 30px;">View Official Source ↗</a>` : ''}
          </div>
        ` : ''}

        <!-- 2. QUICK FACTS STRIP -->
        <div class="univ-quick-facts-strip">
          <div class="fact-tile">
            <div class="fact-label">Recognition</div>
            <div class="fact-value" style="color: var(--trust-green);">${(univ.mode && univ.mode.toLowerCase().includes('offline')) ? 'UGC / AICTE Approved' : 'UGC-DEB Entitled'}</div>
          </div>
          <div class="fact-tile">
            <div class="fact-label">NAAC Rating</div>
            <div class="fact-value">${(univ.approvals && univ.approvals.find(a => a.includes('NAAC'))) || (univ.accreditationDetails && univ.accreditationDetails.naacGrade) || 'NAAC Accredited'}</div>
          </div>
          <div class="fact-tile">
            <div class="fact-label">Programmes</div>
            <div class="fact-value">${(univProgrammes ? univProgrammes.length : univ.totalProgrammes || 1)}+ Degrees</div>
          </div>
          <div class="fact-tile">
            <div class="fact-label">Established</div>
            <div class="fact-value">${univ.established ? 'Year ' + univ.established : 'Verified'}</div>
          </div>
          <div class="fact-tile">
            <div class="fact-label">Starting Fee</div>
            <div class="fact-value" style="color: var(--trust-green);">${univ.startingFee || 'On Request'}</div>
          </div>
        </div>

        <!-- 3. TWO-COLUMN BALANCED CONTENT GRID -->
        <div class="university-page-grid">
          
          <!-- LEFT COLUMN CONTENT -->
          <div class="univ-main-content">
            
            <!-- CARD 1: CAMPUS LIFE & INFRASTRUCTURE SHOWCASE -->
            <div class="product-card-box">
              <h2 class="box-title">Campus Life &amp; Infrastructure Showcase</h2>
              <p class="box-subtext">Explore the physical infrastructure, digital broadcast labs, and academic environment supporting your degree.</p>
              
              <div class="campus-gallery-grid">
                <div class="campus-photo-card">
                  <img src="${gallery[0]}" alt="${univ.name} Main Campus" loading="lazy" onerror="this.src='${defaultGallery[0]}'" />
                  <div class="campus-photo-caption">🏛️ Academic Campus &amp; Infrastructure</div>
                </div>
                <div class="campus-photo-card">
                  <img src="${gallery[1]}" alt="${univ.name} Digital Library" loading="lazy" onerror="this.src='${defaultGallery[1]}'" />
                  <div class="campus-photo-caption">📚 Digital Library &amp; e-Resources</div>
                </div>
                <div class="campus-photo-card">
                  <img src="${gallery[2]}" alt="${univ.name} Virtual Labs" loading="lazy" onerror="this.src='${defaultGallery[2]}'" />
                  <div class="campus-photo-caption">💻 Virtual Cloud Sandbox Labs</div>
                </div>
                <div class="campus-photo-card">
                  <img src="${gallery[3]}" alt="${univ.name} Convocation &amp; Summits" loading="lazy" onerror="this.src='${defaultGallery[3]}'" />
                  <div class="campus-photo-caption">🎓 Student Summits &amp; Convocation</div>
                </div>
              </div>
            </div>

            <!-- CARD 2: ABOUT & HIGHLIGHTS -->
            <div class="product-card-box">
              <h2 class="box-title">About ${univ.shortName || univ.name}</h2>
              <p class="box-text" style="color: #334155; line-height: 1.65; font-size: 0.95rem;">${univ.description}</p>
              ${univ.highlights ? `
                <div class="highlights-grid" style="margin-top: 20px;">
                  ${univ.highlights.map(h => `
                    <div class="highlight-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005A2B" stroke-width="3" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>${h}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>

            <!-- CARD 3: ACCREDITATION & REGULATORY TRUST -->
            <div class="product-card-box">
              <h2 class="box-title">Accreditation &amp; Regulatory Trust</h2>
              <p class="box-subtext">Verified statutory compliance ensuring degree parity for government jobs, civil services, and global credential evaluations.</p>
              
              <div class="accreditation-cards-grid">
                <div class="accred-card">
                  <div class="accred-badge">UGC-DEB</div>
                  <h4>Distance Education Bureau</h4>
                  <p>${univ.accreditationDetails ? univ.accreditationDetails.ugcStatus : 'Statutory entitlement under UGC ODL & Online Regulations.'}</p>
                </div>
                <div class="accred-card">
                  <div class="accred-badge">NAAC</div>
                  <h4>Accreditation Grade</h4>
                  <p>${univ.accreditationDetails ? univ.accreditationDetails.naacGrade : 'Assessed & accredited by NAAC with high academic standing.'}</p>
                </div>
                <div class="accred-card">
                  <div class="accred-badge">AUTONOMY</div>
                  <h4>Category Status</h4>
                  <p>${univ.accreditationDetails ? univ.accreditationDetails.autonomy : 'Enjoys Category 1 Graded Autonomy from University Grants Commission.'}</p>
                </div>
              </div>
            </div>

            <!-- CARD 4: OFFERED PROGRAMMES -->
            <div class="product-card-box" id="univProgrammesSection">
              <div class="box-header-flex">
                <div>
                  <h2 class="box-title">Programmes Offered (${univProgrammes.length})</h2>
                  <p class="box-subtext" style="margin-bottom: 0;">Explore verified degree offerings delivered by ${univ.shortName || univ.name}:</p>
                </div>
                <div class="filter-tab-pills">
                  <button class="pill-btn active" onclick="app.filterUnivProgs('ALL', this, '${univ.id}')">All (${univProgrammes.length})</button>
                  <button class="pill-btn" onclick="app.filterUnivProgs('PG', this, '${univ.id}')">Postgraduate (PG)</button>
                  <button class="pill-btn" onclick="app.filterUnivProgs('UG', this, '${univ.id}')">Undergraduate (UG)</button>
                </div>
              </div>

              <div id="univProgsContainer" style="margin-top: 24px;">
                ${univProgrammes.map(p => this.createProgrammeCardHTML(p)).join('')}
              </div>
            </div>

            <!-- CARD 5: ACADEMIC & LEARNING EXPERIENCE -->
            <div class="product-card-box">
              <h2 class="box-title">Academic &amp; Learning Experience</h2>
              <p class="box-subtext">How academic coursework, practical labs, and assessments are delivered:</p>
              <div class="experience-features-grid">
                <div class="exp-feature-card">
                  <div class="exp-icon">📱</div>
                  <h4>LMS &amp; Mobile Portal</h4>
                  <p>${univ.learningExperience ? univ.learningExperience.lmsApp : '24/7 access to recorded lectures & study material.'}</p>
                </div>
                <div class="exp-feature-card">
                  <div class="exp-icon">🎥</div>
                  <h4>Live Interactive Classes</h4>
                  <p>${univ.learningExperience ? univ.learningExperience.liveClasses : 'Weekend live interactive masterclasses with senior faculty.'}</p>
                </div>
                <div class="exp-feature-card">
                  <div class="exp-icon">🛡️</div>
                  <h4>Remote Proctored Exams</h4>
                  <p>${univ.learningExperience ? univ.learningExperience.exams : '100% online remote AI proctored semester exams with flexible slots.'}</p>
                </div>
                <div class="exp-feature-card">
                  <div class="exp-icon">🎧</div>
                  <h4>24/7 Academic Support</h4>
                  <p>${univ.learningExperience ? univ.learningExperience.support : 'Dedicated academic coordinator support and success coaching.'}</p>
                </div>
              </div>
            </div>

            <!-- CARD 6: CAREER ENABLEMENT INFRASTRUCTURE -->
            <div class="product-card-box">
              <h2 class="box-title">Career Enablement Infrastructure</h2>
              <p class="box-subtext">${univ.careerSupport ? univ.careerSupport.services : 'Resume reviews, mock interviews, and virtual hiring drives.'}</p>

              <div class="career-advisory-callout">
                <div class="callout-icon">💡</div>
                <div>
                  <strong>NEXORA Statutory Advisory: Placement Enablement vs Guarantee</strong>
                  <p>Responsible platforms provide placement enablement (resume scoring, mock interviews, corporate referrals). No accredited university guarantees employment. Always verify skill alignment.</p>
                </div>
              </div>

              ${univ.careerSupport && univ.careerSupport.partners ? `
                <div class="hiring-partners-wrap">
                  <span class="partners-title">Top Hiring Partners &amp; Recruiters:</span>
                  <div class="partner-chips">
                    ${univ.careerSupport.partners.map(cp => `<span class="partner-chip">${cp}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- CARD 7: STUDENT REVIEWS -->
            <div class="product-card-box">
              <h2 class="box-title">Student Reviews &amp; Ratings (★ ${univ.rating || '4.8'} / 5.0)</h2>
              <p class="box-subtext">Verified learner evaluations and feedback from alumni:</p>
              <div class="reviews-list">
                ${univ.reviewsList ? univ.reviewsList.map(r => `
                  <div class="review-card">
                    <div class="review-header">
                      <div>
                        <strong style="color: var(--navy); font-size: 0.95rem;">${r.name}</strong>
                        <span class="review-batch">• ${r.batch} (${r.role})</span>
                      </div>
                      <span class="review-stars">★ ${r.rating}.0</span>
                    </div>
                    <p class="review-comment">"${r.comment}"</p>
                  </div>
                `).join('') : '<p style="color: var(--charcoal-muted); margin:0;">High overall student rating based on verified learner feedback.</p>'}
              </div>
            </div>

            <!-- CARD 8: FAQS -->
            ${univ.faqs ? `
              <div class="product-card-box">
                <h2 class="box-title">Frequently Asked Questions</h2>
                <p class="box-subtext">Statutory answers regarding admissions, exams, and degree validity:</p>
                <div class="faq-container" style="margin-top: 16px;">
                  ${univ.faqs.map(f => `
                    <div class="faq-item" onclick="this.classList.toggle('active')">
                      <div class="faq-question">
                        <span>${f.q}</span>
                        <span class="faq-icon">+</span>
                      </div>
                      <div class="faq-answer"><p>${f.a}</p></div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>

          <!-- RIGHT SIDEBAR -->
          <div class="univ-sidebar">
            
            <!-- SIDEBAR CARD 1: TAKE THE NEXT STEP -->
            <div class="sidebar-sticky-card">
              <div style="border-bottom: 1.5px solid var(--border-grey); padding-bottom: 16px;">
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--charcoal-muted); text-transform: uppercase; letter-spacing: 0.6px;">STARTING ACADEMIC FEE</span>
                <div style="font-size: 2rem; font-weight: 900; color: var(--trust-green); line-height: 1.15; margin: 4px 0;">${univ.startingFee || 'On Request'}</div>
                <div style="font-size: 0.88rem; color: var(--navy); font-weight: 700;">${univ.totalProgrammes || (univProgrammes ? univProgrammes.length : 1)}+ Approved Degree Programmes</div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
                <button class="btn btn-primary btn-block btn-lg" onclick="app.openInfoRequestModal('${univ.name}', 'University Admission Packet')" style="font-weight: 800;">
                  Get Info Packet
                </button>
                <button class="btn btn-secondary btn-block" data-compare-id="${univ.id}" onclick="app.compareManager.toggleCompare('${univ.id}')" style="font-weight: 750;">
                  + Add to Compare
                </button>
                ${univ.websiteUrl ? `
                  <a href="${univ.websiteUrl}" target="_blank" rel="noopener" class="btn btn-outline-navy btn-block" style="text-align: center; text-decoration: none;">
                    Visit Official Website ↗
                  </a>
                ` : ''}
              </div>

              <div class="sidebar-meta-list" style="margin-top: 14px; padding-top: 16px; border-top: 1px solid var(--border-grey); display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between;"><span>Established:</span><strong style="color: var(--navy);">${univ.established || 'Recognized'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Location:</span><strong style="color: var(--navy); text-align: right;">${univ.location}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Learning Mode:</span><strong style="color: var(--navy);">${univ.mode || '100% Online'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Approvals & Status:</span><strong style="color: var(--trust-green);">${(univ.mode && univ.mode.toLowerCase().includes('offline')) ? 'UGC, AICTE & NAAC Accredited' : 'UGC-DEB Entitled'}</strong></div>
              </div>
            </div>

            <!-- SIDEBAR CARD 2: SIMILAR UNIVERSITIES -->
            <div class="sidebar-sticky-card" style="padding: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 850; color: var(--navy); margin-bottom: 12px;">Similar Accredited Universities</h3>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${similarUniversities.map(sim => `
                  <div class="similar-programme-card" onclick="app.navigateToUniversity('${sim.id}')">
                    <img src="${sim.image || 'assets/campus.jpg'}" alt="${sim.name}" class="similar-prog-img-thumb" loading="lazy" onerror="this.src='assets/campus.jpg'" />
                    <div class="similar-prog-info">
                      <span class="similar-prog-title" title="${sim.name}">${sim.name}</span>
                      <span class="similar-prog-univ">📍 ${sim.location}</span>
                      <span class="similar-prog-fee">From ${sim.startingFee}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- SIDEBAR CARD 3: STATUTORY VERIFICATION BADGE -->
            <div style="background: rgba(0, 90, 43, 0.05); border: 1.5px dashed var(--trust-green); border-radius: 14px; padding: 18px 20px; text-align: center;">
              <div style="font-size: 1.6rem; margin-bottom: 6px;">🛡️</div>
              <div style="font-size: 0.9rem; font-weight: 850; color: var(--trust-green);">UGC Statutory Degree Parity</div>
              <p style="font-size: 0.78rem; color: #475569; margin: 6px 0 0 0; line-height: 1.45;">
                Degrees conferred by accredited and entitled HEIs hold 100% statutory validity for higher education and government exams across India.
              </p>
            </div>

          </div>

        </div>

      </div>

      <!-- STICKY MOBILE ACTION BAR -->
      <div class="sticky-bottom-action-bar">
        <div class="bar-container">
          <button class="btn btn-secondary btn-sm" data-compare-id="${univ.id}" onclick="app.compareManager.toggleCompare('${univ.id}')">
            + Compare
          </button>
          <button class="btn btn-primary btn-sm" onclick="app.openInfoRequestModal('${univ.name}', 'University Admission Packet')">
            Get Information
          </button>
        </div>
      </div>
    `;
  }


  /* ---------------------------------------------------- */
  /* PAGE 3 — FULL DEDICATED PROGRAMME PAGE RENDERER      */
  /* ---------------------------------------------------- */
  renderFullProgrammePage(progId, container) {
    const prog = window.app ? window.app.getProgrammeById(progId) : NEXORA_DATA.programmes.find(p => p.id === progId);
    if (!prog || !container) return;

    const parentUniv = (window.app ? window.app.getUniversityById(prog.universityId) : null) || NEXORA_DATA.universities.find(u => u.id === prog.universityId) || { name: prog.universityName, shortName: prog.universityName, logo: '', location: 'India' };
    const relatedProgs = (NEXORA_DATA.programmes || []).filter(p => p.id !== prog.id).slice(0, 4);
    const sameDegreeProgs = (NEXORA_DATA.programmes || []).filter(p => p.level === prog.level && p.id !== prog.id).slice(0, 2);
    const isSaved = window.app ? window.app.isWishlisted(prog.id, 'programme') : false;
    const isCompared = (window.app && window.app.compareManager && typeof window.app.compareManager.hasItem === 'function')
      ? window.app.compareManager.hasItem(prog.id)
      : false;

    const heroImage = (window.app && window.app.getProgrammeImage)
      ? window.app.getProgrammeImage(prog)
      : (prog.image || parentUniv.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80');

    // Safe fallbacks for all programmes
    const specialisationsList = (prog.specialisations && prog.specialisations.length > 0)
      ? prog.specialisations
      : [`${prog.shortDegree || 'Applied'} Strategy`, 'Data Analytics & Intelligence', 'Global Leadership', 'Digital Transformation'];

    const careerPathsList = (prog.careerPaths && prog.careerPaths.length > 0)
      ? prog.careerPaths
      : ['Senior Strategy Consultant', 'Business Systems Analyst', 'Corporate Operations Director', 'Product Manager'];

    const curriculumObj = (prog.curriculum && typeof prog.curriculum === 'object' && Object.keys(prog.curriculum).length > 0)
      ? prog.curriculum
      : {
          sem1: ['Foundations of Management & Technology', 'Quantitative Decision Methods', 'Organizational Behaviour & Leadership', 'Managerial Economics', 'Business Communication'],
          sem2: ['Financial Strategy & Accounting', 'Operational Excellence & Supply Chain', 'Marketing & Customer Intelligence', 'Research & Analysis Frameworks', 'Corporate Ethics & Law'],
          sem3: ['Specialisation Core Elective I', 'Specialisation Advanced Elective II', 'Digital Enterprise Transformation', 'Applied Predictive Analytics', 'Strategic Governance'],
          sem4: ['Industry Capstone Practicum', 'Cross-Border Strategic Management', 'Executive Portfolio Review', 'Viva Voce & Master Project']
        };

    const expObj = prog.learningExperience || {
      liveClasses: '12-15 hours/week of live interactive weekend masterclasses with senior faculty and corporate practitioners',
      lmsApp: '24/7 access to cloud learning portal with iOS/Android app, offline downloads, and digital library',
      exams: '100% online remote AI proctored semester examinations with flexible time slot booking',
      faculty: 'Senior doctoral campus professors and seasoned industry executives with Fortune 500 experience'
    };

    const galleryPhotos = [
      (parentUniv.gallery && parentUniv.gallery[0]) || parentUniv.image || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
      (parentUniv.gallery && parentUniv.gallery[1]) || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      (parentUniv.gallery && parentUniv.gallery[2]) || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      (parentUniv.gallery && parentUniv.gallery[3]) || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'
    ];

    container.innerHTML = `
      <!-- TOP BREADCRUMB NAV -->
      <div class="page-view-header">
        <div class="container" style="max-width: 1280px;">
          <div class="page-breadcrumb-nav">
            <button class="back-link-btn" onclick="app.navigateToProgrammesPage()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Back to Programmes</span>
            </button>
            <div class="breadcrumb-trail">
              <span class="crumb" onclick="app.navigateToHome()">Home</span>
              <span class="crumb-sep">/</span>
              <span class="crumb" onclick="app.navigateToProgrammesPage()">Programmes</span>
              <span class="crumb-sep">/</span>
              <span class="crumb" onclick="app.navigateToUniversity('${prog.universityId}')">${parentUniv.shortName || prog.universityName}</span>
              <span class="crumb-sep">/</span>
              <span class="crumb active">${prog.name}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN PAGE WRAPPER (CENTERED & PROPORTIONED) -->
      <div class="container" style="max-width: 1280px; padding-top: 24px; padding-bottom: 60px;">

        <!-- 1. HIGH-IMPACT PROGRAMME HERO BANNER WITH PHOTOGRAPHY -->
        <div class="programme-page-hero-banner">
          <img src="${heroImage}" alt="${prog.name}" class="prog-hero-bg-img" onerror="this.src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'" />
          
          <div class="prog-hero-overlay">
            <div class="prog-hero-top-row">
              <div class="prog-univ-pill-hero" onclick="app.navigateToUniversity('${prog.universityId}')" title="Explore ${parentUniv.name || prog.universityName}">
                ${parentUniv.logo ? `<img src="${parentUniv.logo}" alt="${parentUniv.shortName} Logo" onerror="this.style.display='none';" />` : ''}
                <span>🏛️ ${parentUniv.name || prog.universityName}</span>
              </div>
              <div class="prog-hero-badges-flex">
                <span class="badge badge-trust">🎓 ${prog.level} Degree</span>
                <span class="badge badge-navy">${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? '🏛️ ' + prog.mode : '🌐 ' + (prog.mode || '100% Online')}</span>
                <span class="badge badge-sage">🛡️ ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'UGC / AICTE Approved' : 'UGC-DEB Entitled'}</span>
                ${prog.sourceType === 'external' ? '<span class="badge" style="background: rgba(0,102,255,0.25); color: #60A5FA; border: 1px solid rgba(0,102,255,0.4); font-weight: 800;">VERIFIED EXTERNAL</span>' : ''}
              </div>
            </div>

            <div>
              <h1 class="prog-hero-title-main">${prog.name}</h1>
              <div class="prog-hero-meta-subtitle">
                <span>📍 ${parentUniv.location || 'India'}</span>
                <span>•</span>
                <span>⭐ ★ ${prog.rating || '4.8'} (${prog.reviewCount || '200+'} Student Reviews)</span>
                <span>•</span>
                <span>📅 ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'Academic Session 2026-27' : 'Entitled by UGC-DEB 2026-27'}</span>
              </div>

              <!-- GLASSMORPHIC STATS STRIP -->
              <div class="prog-quick-facts-strip">
                <div class="prog-fact-tile">
                  <div class="prog-fact-label">Duration</div>
                  <div class="prog-fact-value">${prog.duration || '2 Years'}</div>
                </div>
                <div class="prog-fact-tile">
                  <div class="prog-fact-label">Total Fee</div>
                  <div class="prog-fact-value highlight-green">${prog.totalFee}</div>
                </div>
                <div class="prog-fact-tile">
                  <div class="prog-fact-label">Semester Fee</div>
                  <div class="prog-fact-value">${prog.semesterFee || '₹35,000 / Sem'}</div>
                </div>
                <div class="prog-fact-tile">
                  <div class="prog-fact-label">Mode</div>
                  <div class="prog-fact-value">${prog.mode || '100% Online'}</div>
                </div>
                <div class="prog-fact-tile">
                  <div class="prog-fact-label">EMI Financing</div>
                  <div class="prog-fact-value" style="color: #60A5FA;">${prog.emiAvailable ? '0% No-Cost EMI' : 'Flexible EMI'}</div>
                </div>
              </div>
            </div>

            <!-- HERO CTAs -->
            <div class="prog-hero-cta-group">
              <button class="btn btn-primary btn-lg" onclick="app.openInfoRequestModal('${prog.name}', '${prog.universityName}')" style="font-weight: 800; border-radius: 50px; padding: 12px 28px;">
                Get Information Packet
              </button>
              <button class="btn btn-secondary btn-lg" data-compare-id="${prog.id}" onclick="app.compareManager.toggleCompareProgramme('${prog.id}')" style="font-weight: 750; border-radius: 50px; padding: 12px 24px;">
                ${isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
              </button>
              <button class="btn btn-outline-navy btn-lg shortlist-toggle-btn ${isSaved ? 'saved' : ''}" style="background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); color: #fff; border-radius: 50px; padding: 12px 24px;" onclick="app.toggleWishlist('${prog.id}', 'programme')">
                <span>${isSaved ? '♥ Wishlisted' : '♡ Save Degree'}</span>
              </button>
              ${prog.officialProgrammeUrl ? `
                <a href="${prog.officialProgrammeUrl}" target="_blank" rel="noopener" class="btn btn-sm" style="color: rgba(255,255,255,0.85); text-decoration: underline; margin-left: auto;">
                  Official University Portal ↗
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- 2. TWO-COLUMN BALANCED CONTENT GRID -->
        <div class="programme-page-grid">

          <!-- MAIN LEFT CONTENT COLUMN -->
          <div class="prog-main-content">

            <!-- CARD 1: KEY PROGRAMME DETAILS -->
            <div class="product-card-box">
              <h2 class="box-title">Key Programme Details &amp; Structure</h2>
              <p class="box-subtext">Comprehensive overview of academic timeline, cost schedule, and delivery specifications:</p>
              <div class="key-details-panel">
                <div class="detail-cell">
                  <span class="d-label">Academic Duration</span>
                  <strong class="d-val">${prog.duration || '2 Years (4 Semesters)'}</strong>
                </div>
                <div class="detail-cell">
                  <span class="d-label">Total Fee Structure</span>
                  <strong class="d-val text-green">${prog.totalFee}</strong>
                </div>
                <div class="detail-cell">
                  <span class="d-label">Semester Installment</span>
                  <strong class="d-val">${prog.semesterFee || 'Flexible Per Sem'}</strong>
                </div>
                <div class="detail-cell">
                  <span class="d-label">No-Cost EMI Options</span>
                  <strong class="d-val">${prog.emiAvailable ? 'Available (6, 12, 18, 24 Months)' : 'Installment Plans Available'}</strong>
                </div>
                <div class="detail-cell">
                  <span class="d-label">Learning Delivery Mode</span>
                  <strong class="d-val">${prog.mode || '100% Online'}</strong>
                </div>
                <div class="detail-cell">
                  <span class="d-label">Examination Format</span>
                  <strong class="d-val">${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'On-Campus Term Examinations & Labs' : '100% Online Remote AI Proctored'}</strong>
                </div>
              </div>
            </div>

            <!-- CARD 2: PROGRAMME OVERVIEW & ELIGIBILITY -->
            <div class="product-card-box">
              <h2 class="box-title">Programme Overview &amp; Eligibility</h2>
              <p class="box-subtext" style="margin-bottom: 12px; color: #334155; line-height: 1.65; font-size: 0.95rem;">
                The <strong>${prog.name}</strong> delivered by <strong>${prog.universityName}</strong> is ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'a full-time on-campus academic degree programme engineered with cutting-edge laboratory facilities, immersive faculty mentoring, and campus placement drives.' : 'a UGC-DEB entitled academic degree engineered to provide students and professionals with industry-relevant skills, flexible digital learning schedules, and official university credentials.'}
              </p>

              <div style="background: rgba(0, 90, 43, 0.05); border: 1.5px solid rgba(0, 90, 43, 0.2); border-radius: 14px; padding: 20px 24px; margin-top: 18px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                  <span style="font-size: 1.2rem;">📋</span>
                  <h4 style="font-size: 1.05rem; font-weight: 850; color: var(--navy); margin: 0;">Mandatory Eligibility Criteria</h4>
                </div>
                <p style="margin: 0; color: #1e293b; font-size: 0.92rem; line-height: 1.6;">${prog.eligibility || 'Graduation with minimum 50% marks from a recognized university.'}</p>
              </div>
            </div>

            <!-- CARD 3: CAMPUS & DIGITAL LEARNING ENVIRONMENT GALLERY (PHOTOS!) -->
            <div class="product-card-box">
              <div class="box-header-flex">
                <div>
                  <h2 class="box-title">Campus &amp; Digital Learning Environment</h2>
                  <p class="box-subtext">Visual preview of institutional infrastructure, digital broadcast studios, and learning facilities:</p>
                </div>
                <span class="badge badge-navy">4 Facilities</span>
              </div>

              <div class="prog-gallery-grid">
                <div class="prog-gallery-card">
                  <img src="${galleryPhotos[0]}" alt="${prog.universityName} Campus" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80'" />
                  <div class="prog-gallery-caption">🏛️ University Main Campus</div>
                </div>
                <div class="prog-gallery-card">
                  <img src="${galleryPhotos[1]}" alt="Digital Live Lecture Studio" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'" />
                  <div class="prog-gallery-caption">🎥 Broadcast Lecture Studio</div>
                </div>
                <div class="prog-gallery-card">
                  <img src="${galleryPhotos[2]}" alt="Collaborative Study & Tech Labs" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'" />
                  <div class="prog-gallery-caption">💻 Digital Labs &amp; Tech Hub</div>
                </div>
                <div class="prog-gallery-card">
                  <img src="${galleryPhotos[3]}" alt="Central Library & Innovation Center" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80'" />
                  <div class="prog-gallery-caption">📚 Central Digital Library</div>
                </div>
              </div>
            </div>

            <!-- CARD 4: SPECIALISATIONS -->
            <div class="product-card-box">
              <h2 class="box-title">Specialisation Tracks Offered (${specialisationsList.length})</h2>
              <p class="box-subtext">Align your degree electives with high-growth industry roles and domains:</p>
              <div class="specialisation-chips-grid">
                ${specialisationsList.map(s => `
                  <div class="spec-chip-card">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005A2B" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${s}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- CARD 5: CURRICULUM ACCORDION -->
            <div class="product-card-box">
              <h2 class="box-title">Curriculum &amp; Module Structure</h2>
              <p class="box-subtext">Click any semester below to inspect individual academic course modules:</p>
              <div class="curriculum-accordion">
                ${Object.keys(curriculumObj).map((semKey, idx) => `
                  <div class="curriculum-sem-card ${idx === 0 ? 'active' : ''}">
                    <div class="curriculum-sem-header" onclick="this.parentElement.classList.toggle('active')">
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: 850; color: var(--navy); font-size: 0.98rem;">Semester ${idx + 1} Subjects</span>
                        <span class="badge badge-navy" style="font-size: 0.72rem;">${curriculumObj[semKey].length} Modules</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transition: transform 0.2s ease;"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="curriculum-sem-body">
                      <ul class="subject-list">
                        ${curriculumObj[semKey].map(sub => `
                          <li class="subject-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#005A2B" stroke-width="2.8" style="flex-shrink: 0; margin-top: 2px;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span>${sub}</span>
                          </li>
                        `).join('')}
                      </ul>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- CARD 6: LEARNING EXPERIENCE & INFRASTRUCTURE -->
            <div class="product-card-box">
              <h2 class="box-title">Learning Experience &amp; Academic Infrastructure</h2>
              <p class="box-subtext">How delivery, student support, and assessments are structured for this programme:</p>
              <div class="experience-features-grid">
                <div class="exp-feature-card">
                  <h4><span>${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? '🏛️' : '🎥'}</span> ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'Classroom & Studio Learning' : 'Live Interactive Lectures'}</h4>
                  <p>${expObj.classes || expObj.liveClasses || 'Interactive lectures and tutorials'}</p>
                </div>
                <div class="exp-feature-card">
                  <h4><span>${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? '🔬' : '📱'}</span> ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'Labs & Technical Centers' : 'LMS Portal & Mobile App'}</h4>
                  <p>${expObj.labs || expObj.lmsApp || 'Cutting-edge laboratory infrastructure and computing centers'}</p>
                </div>
                <div class="exp-feature-card">
                  <h4><span>${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? '📝' : '🛡️'}</span> ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'Semester Assessments' : 'AI Remote Proctored Exams'}</h4>
                  <p>${expObj.exams || 'Regular semester theory and practical laboratory assessments'}</p>
                </div>
                <div class="exp-feature-card">
                  <h4><span>${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? '🤝' : '👨‍🏫'}</span> ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'Distinguished Faculty & Placements' : 'Distinguished Faculty'}</h4>
                  <p>${expObj.faculty || expObj.placements || 'Doctoral professors and dedicated campus placement assistance'}</p>
                </div>
              </div>
            </div>

            <!-- CARD 7: POTENTIAL CAREER DIRECTIONS -->
            <div class="product-card-box" style="background: rgba(0, 90, 43, 0.03); border-color: rgba(0, 90, 43, 0.18);">
              <h2 class="box-title" style="color: var(--navy);">Aligned Career Directions</h2>
              <p class="box-subtext">Connecting this degree directly to target market roles:</p>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 14px;">
                ${careerPathsList.map(cp => `
                  <div style="background: #ffffff; border: 1.5px solid var(--border-grey); border-radius: 12px; padding: 16px 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                    <div style="font-size: 0.72rem; font-weight: 800; color: var(--trust-green); text-transform: uppercase; letter-spacing: 0.5px;">POTENTIAL TARGET ROLE</div>
                    <div style="font-size: 1rem; font-weight: 850; color: var(--navy); margin-top: 4px;">${cp}</div>
                    <div style="display: inline-block; font-size: 0.75rem; font-weight: 750; color: #0284c7; background: #e0f2fe; padding: 2px 8px; border-radius: 20px; margin-top: 8px;">High Market Demand</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- CARD 8: HOW DOES THIS COMPARE? -->
            <div class="product-card-box">
              <h2 class="box-title">Side-by-Side Alternative Comparison</h2>
              <p class="box-subtext">Benchmark fee, duration, and delivery against alternative accredited options:</p>

              <div style="overflow-x: auto; margin-top: 16px;">
                <table class="compare-matrix-table">
                  <thead>
                    <tr>
                      <th class="compare-param-th">
                        <div style="font-size: 0.72rem; color: #94A3B8; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px;">DECISION FACTOR</div>
                        <div style="font-size: 1rem; font-weight: 850; color: #FFFFFF;">Parameter</div>
                      </th>
                      <th class="compare-current-th">
                        <div style="display: inline-block; background: rgba(255,255,255,0.22); color: #86EFAC; font-size: 0.72rem; font-weight: 800; padding: 2px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">★ Currently Viewing</div>
                        <div style="font-size: 0.98rem; font-weight: 850; color: #FFFFFF; line-height: 1.35;">${prog.name}</div>
                        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.88); margin-top: 4px; font-weight: 600;">🏛️ ${parentUniv.shortName || prog.universityName}</div>
                      </th>
                      ${sameDegreeProgs.map(s => `
                        <th class="compare-alt-th">
                          <div style="display: inline-block; background: rgba(255,255,255,0.12); color: #93C5FD; font-size: 0.72rem; font-weight: 800; padding: 2px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Alternative Option</div>
                          <div style="font-size: 0.98rem; font-weight: 850; color: #FFFFFF; line-height: 1.35;">${s.name}</div>
                          <div style="font-size: 0.8rem; color: rgba(255,255,255,0.85); margin-top: 4px; font-weight: 600;">🏛️ ${s.universityName}</div>
                        </th>
                      `).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="compare-field-label">Total Fee</td>
                      <td class="compare-current-col">
                        <span style="font-size: 1.15rem; font-weight: 900; color: #005A2B;">${prog.totalFee}</span>
                      </td>
                      ${sameDegreeProgs.map(s => `
                        <td>
                          <span style="font-size: 1.02rem; font-weight: 800; color: #1E293B;">${s.totalFee}</span>
                        </td>
                      `).join('')}
                    </tr>
                    <tr>
                      <td class="compare-field-label">Duration</td>
                      <td class="compare-current-col">
                        <span style="font-weight: 800; color: #001B66;">${prog.duration || '2 Years'}</span>
                      </td>
                      ${sameDegreeProgs.map(s => `
                        <td>
                          <span style="color: #475569; font-weight: 600;">${s.duration || '2 Years'}</span>
                        </td>
                      `).join('')}
                    </tr>
                    <tr>
                      <td class="compare-field-label">Mode</td>
                      <td class="compare-current-col">
                        <span style="font-weight: 800; color: #001B66;">${prog.mode || '100% Online'}</span>
                      </td>
                      ${sameDegreeProgs.map(s => `
                        <td>
                          <span style="color: #475569; font-weight: 600;">${s.mode || '100% Online'}</span>
                        </td>
                      `).join('')}
                    </tr>
                    <tr>
                      <td class="compare-field-label">Action</td>
                      <td class="compare-current-col">
                        <span class="badge badge-trust" style="background: rgba(0, 90, 43, 0.12); color: #005A2B; border: 1.5px solid #005A2B; font-weight: 800; font-size: 0.78rem; padding: 6px 14px; border-radius: 50px; white-space: nowrap;">✓ Currently Viewing</span>
                      </td>
                      ${sameDegreeProgs.map(s => `
                        <td>
                          <button class="btn btn-navy btn-sm" onclick="app.navigateToProgramme('${s.id}')" style="border-radius: 50px; font-weight: 750; padding: 7px 16px; white-space: nowrap;">View Details →</button>
                        </td>
                      `).join('')}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- RIGHT STICKY SIDEBAR -->
          <div class="prog-sidebar">

            <!-- SIDEBAR CARD 1: FEE & ACTION -->
            <div class="sidebar-sticky-card">
              <div style="border-bottom: 1.5px solid var(--border-grey); padding-bottom: 18px;">
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--charcoal-muted); text-transform: uppercase; letter-spacing: 0.6px;">TOTAL ACADEMIC FEE</span>
                <div style="font-size: 2rem; font-weight: 900; color: var(--trust-green); line-height: 1.15; margin: 4px 0;">${prog.totalFee}</div>
                <div style="font-size: 0.88rem; color: var(--navy); font-weight: 700;">${prog.semesterFee || 'Flexible Installments'}</div>
                <span class="badge badge-trust" style="margin-top: 8px; font-size: 0.72rem;">✨ ${prog.emiAvailable ? 'No-Cost EMI Starting ₹3,500/mo' : 'EMI Financing Available'}</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                <button class="btn btn-primary btn-block btn-lg" onclick="app.openInfoRequestModal('${prog.name}', '${prog.universityName}')" style="font-weight: 800;">
                  Get Information Packet
                </button>
                <button class="btn btn-secondary btn-block" data-compare-id="${prog.id}" onclick="app.compareManager.toggleCompareProgramme('${prog.id}')" style="font-weight: 750;">
                  ${isCompared ? '✓ Added to Compare' : '+ Add to Compare'}
                </button>
                ${prog.officialProgrammeUrl ? `
                  <a href="${prog.officialProgrammeUrl}" target="_blank" rel="noopener" class="btn btn-outline-navy btn-block" style="text-align: center; text-decoration: none;">
                    Visit University Site ↗
                  </a>
                ` : ''}
              </div>

              <div style="margin-top: 14px; padding-top: 16px; border-top: 1px solid var(--border-grey); display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between;"><span>Institution:</span><strong style="color: var(--navy); text-align: right;">${parentUniv.shortName || prog.universityName}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Academic Level:</span><strong style="color: var(--navy);">${prog.level} Degree</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Duration:</span><strong style="color: var(--navy);">${prog.duration || '2 Years'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Entitlement:</span><strong style="color: var(--trust-green);">${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'UGC & AICTE Approved' : 'UGC-DEB Entitled'}</strong></div>
                <div style="display: flex; justify-content: space-between;"><span>Exam Format:</span><strong style="color: var(--trust-green);">${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'On-Campus Centers' : '100% Online Proctored'}</strong></div>
              </div>
            </div>

            <!-- SIDEBAR CARD 2: RELATED PROGRAMMES (WITH IMAGES!) -->
            <div class="sidebar-sticky-card" style="padding: 20px;">
              <h3 style="font-size: 1.1rem; font-weight: 850; color: var(--navy); margin-bottom: 12px;">Related Degree Programmes</h3>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${relatedProgs.map(rel => {
                  const relImg = (window.app && window.app.getProgrammeImage)
                    ? window.app.getProgrammeImage(rel)
                    : (rel.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80');
                  return `
                    <div class="similar-programme-card" onclick="app.navigateToProgramme('${rel.id}')">
                      <img src="${relImg}" alt="${rel.name}" class="similar-prog-img-thumb" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80'" />
                      <div class="similar-prog-info">
                        <span class="similar-prog-title" title="${rel.name}">${rel.name}</span>
                        <span class="similar-prog-univ">${rel.universityName}</span>
                        <span class="similar-prog-fee">${rel.totalFee}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- SIDEBAR CARD 3: OFFICIAL VERIFICATION BADGE -->
            <div style="background: rgba(0, 90, 43, 0.05); border: 1.5px dashed var(--trust-green); border-radius: 14px; padding: 18px 20px; text-align: center;">
              <div style="font-size: 1.6rem; margin-bottom: 6px;">🛡️</div>
              <div style="font-size: 0.9rem; font-weight: 850; color: var(--trust-green);">UGC-DEB Statutory Entitled</div>
              <p style="font-size: 0.78rem; color: #475569; margin: 6px 0 0 0; line-height: 1.45;">
                Degrees awarded are fully recognized under Section 22 of the UGC Act 1956 for higher education and government employment across India.
              </p>
            </div>

          </div>

        </div>

      </div>

      <!-- STICKY MOBILE ACTION BAR -->
      <div class="sticky-bottom-action-bar">
        <div class="bar-container">
          <button class="btn btn-secondary btn-sm" data-compare-id="${prog.id}" onclick="app.compareManager.toggleCompareProgramme('${prog.id}')">
            + Compare
          </button>
          <button class="btn btn-primary btn-sm" onclick="app.openInfoRequestModal('${prog.name}', '${prog.universityName}')">
            Get Information Packet
          </button>
        </div>
      </div>
    `;
  }

  /* Helper to render clean Programme Card */
  createProgrammeCardHTML(prog) {
    const isSaved = window.app ? window.app.isWishlisted(prog.id, 'programme') : false;
    const isCompared = (window.app && window.app.compareManager && typeof window.app.compareManager.hasItem === 'function')
      ? window.app.compareManager.hasItem(prog.id)
      : false;
    const degreeBadge = window.app ? window.app.getDegreeBadgeLabel(prog) : (prog.level + ' Degree');
    const progImg = (window.app && window.app.getProgrammeImage)
      ? window.app.getProgrammeImage(prog)
      : (prog.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80');

    return `
      <div class="programme-card">
        <div class="programme-card-hero">
          <img src="${progImg}" alt="${prog.name}" class="programme-card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'" />
          <button class="shortlist-toggle-btn programme-hero-save-btn ${isSaved ? 'saved' : ''}" data-shortlist-id="${prog.id}" onclick="event.stopPropagation(); app.toggleWishlist('${prog.id}', 'programme')" title="Save Degree">
            ${isSaved ? '♥ Wishlisted' : '♡ Save'}
          </button>
        </div>

        <div class="programme-card-body">
          <div class="programme-badges-flex" style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
            <span class="badge badge-trust" style="font-size: 0.72rem; padding: 3px 8px; font-weight: 750;">🎓 ${degreeBadge}</span>
            <span class="badge badge-navy" style="font-size: 0.72rem; padding: 3px 8px;">${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? '🏛️ ' + prog.mode : '🌐 ' + (prog.mode || 'Online')}</span>
          </div>

          <h3 class="programme-card-title" onclick="app.navigateToProgramme('${prog.id}')" title="${prog.name}" style="cursor: pointer; font-size: 1.15rem; font-weight: 850; color: var(--navy); line-height: 1.35; margin-bottom: 10px;">${prog.name}</h3>

          <div class="programme-specs-chips" style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
            <span class="spec-pill" style="font-size: 0.76rem; background: #F1F5F9; padding: 3px 8px; border-radius: 6px; font-weight: 650; color: #475569;">⏱️ ${prog.duration || '2 Years'}</span>
            <span class="spec-pill" style="font-size: 0.76rem; background: #F1F5F9; padding: 3px 8px; border-radius: 6px; font-weight: 650; color: #475569;">🛡️ ${(prog.mode && (prog.mode.toLowerCase().includes('offline') || prog.mode.toLowerCase().includes('campus'))) ? 'UGC / AICTE' : 'UGC-DEB'}</span>
            ${prog.emiAvailable ? '<span class="spec-pill" style="font-size: 0.76rem; background: #ECFDF5; color: var(--trust-green); padding: 3px 8px; border-radius: 6px; font-weight: 750;">0% EMI</span>' : ''}
          </div>

          <div class="programme-card-footer" style="margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border-grey); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div class="programme-fee-box">
              <div class="programme-fee-main" style="font-size: 1.15rem; font-weight: 900; color: var(--trust-green);">${prog.totalFee}</div>
              <div style="font-size: 0.75rem; color: var(--charcoal-muted);">${prog.semesterFee || 'Flexible Installments'}</div>
            </div>

            <div class="programme-card-actions" style="display: flex; gap: 8px;">
              <button class="btn btn-navy btn-sm" onclick="app.navigateToProgramme('${prog.id}')" style="display: inline-flex; align-items: center; gap: 6px;">
                <span>View Details</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button class="btn btn-secondary btn-sm" data-compare-id="${prog.id}" onclick="app.compareManager.toggleCompareProgramme('${prog.id}')">
                ${isCompared ? '✓ Added' : '+ Compare'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------------------------------------------------- */
  /* WISHLIST / SHORTLIST MODAL RENDERER                  */
  /* ---------------------------------------------------- */
  renderShortlistModal(activeTab = 'universities') {
    this.renderWishlistModal(activeTab);
  }

  renderWishlistModal(activeTab = 'universities') {
    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = "My Saved Wishlist & Shortlist";
    }

    const wishlist = (window.app && window.app.wishlist) ? window.app.wishlist : { universities: [], programmes: [] };

    // Resolve University Objects
    const savedUniversities = (wishlist.universities || [])
      .map(id => window.app ? window.app.getUniversityById(id) : NEXORA_DATA.universities.find(u => u.id === id))
      .filter(Boolean);

    // Resolve Programme Objects
    const savedProgrammes = (wishlist.programmes || [])
      .map(id => window.app ? window.app.getProgrammeById(id) : NEXORA_DATA.programmes.find(p => p.id === id))
      .filter(Boolean);

    modalBody.innerHTML = `
      <div class="wishlist-modal-container">
        <!-- TAB CONTROLS -->
        <div style="display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border-grey); padding-bottom: 12px;">
          <button class="btn btn-sm wishlist-tab ${activeTab === 'universities' ? 'btn-primary active' : 'btn-secondary'}" onclick="app.switchWishlistTab('universities')">
            🏛️ Saved Universities (${savedUniversities.length})
          </button>
          <button class="btn btn-sm wishlist-tab ${activeTab === 'programmes' ? 'btn-primary active' : 'btn-secondary'}" onclick="app.switchWishlistTab('programmes')">
            🎓 Saved Programmes (${savedProgrammes.length})
          </button>
        </div>

        <!-- UNIVERSITIES TAB -->
        ${activeTab === 'universities' ? `
          ${savedUniversities.length === 0 ? `
            <div style="text-align: center; padding: 48px 20px; background: var(--soft-white); border-radius: 12px; border: 1px solid var(--border-grey);">
              <div style="font-size: 2.5rem; margin-bottom: 12px;">🏛️</div>
              <h3 style="font-size: 1.2rem; color: var(--navy); margin-bottom: 6px;">No Saved Universities Yet</h3>
              <p style="color: var(--charcoal-muted); font-size: 0.9rem; max-width: 420px; margin: 0 auto 20px auto;">
                Explore verified universities and save the ones you want to revisit into your personal wishlist.
              </p>
              <button class="btn btn-primary btn-sm" onclick="app.closeModal(); app.navigateToUniversitiesPage();">
                Explore Universities
              </button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${savedUniversities.map(u => `
                <div style="background: var(--pure-white); padding: 20px; border-radius: 12px; border: 1px solid var(--border-grey); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                  <div style="display: flex; align-items: center; gap: 16px;">
                    <img src="${u.logo}" alt="${u.name}" style="width: 56px; height: 56px; object-fit: contain; border-radius: 10px; background: #fff; padding: 4px; border: 1.5px solid var(--border-grey); box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0;" onerror="this.style.display='none';" />
                  <div>
                    <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 4px;">
                      <span class="badge badge-trust">University</span>
                      ${u.approvals.map(a => `<span class="badge badge-grey">${a}</span>`).join('')}
                    </div>
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--navy); margin: 0;">${u.name}</h4>
                    <div style="font-size: 0.85rem; color: var(--charcoal-muted); margin-top: 4px;">
                      📍 ${u.location} • 🎓 ${u.totalProgrammes} Degrees Offered • Starting From <strong style="color: var(--trust-green);">${u.startingFee}</strong>
                    </div>
                  </div>
                </div>

                  <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                    <button class="btn btn-navy btn-sm" onclick="app.closeModal(); app.navigateToUniversity('${u.id}')">
                      View University Page
                    </button>
                    <button class="btn btn-secondary btn-sm" data-compare-id="${u.id}" onclick="app.compareManager.toggleCompareUniversity('${u.id}')">
                      + Add to Compare
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="app.toggleWishlist('${u.id}', 'university'); app.openWishlistModal('universities');">
                      Remove
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        ` : ''}

        <!-- PROGRAMMES TAB -->
        ${activeTab === 'programmes' ? `
          ${savedProgrammes.length === 0 ? `
            <div style="text-align: center; padding: 48px 20px; background: var(--soft-white); border-radius: 12px; border: 1px solid var(--border-grey);">
              <div style="font-size: 2.5rem; margin-bottom: 12px;">🎓</div>
              <h3 style="font-size: 1.2rem; color: var(--navy); margin-bottom: 6px;">No Saved Programmes Yet</h3>
              <p style="color: var(--charcoal-muted); font-size: 0.9rem; max-width: 420px; margin: 0 auto 20px auto;">
                Explore accredited online degree programmes and save the ones you want to compare into your wishlist.
              </p>
              <button class="btn btn-primary btn-sm" onclick="app.closeModal(); app.navigateToHome(); app.scrollToSection('programmes');">
                Explore Programmes
              </button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${savedProgrammes.map(p => `
                <div style="background: var(--pure-white); padding: 20px; border-radius: 12px; border: 1px solid var(--border-grey); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                  <div>
                    <div style="font-size: 0.75rem; font-weight: 700; color: var(--sage-green); text-transform: uppercase;">${p.universityName}</div>
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: var(--navy); margin-top: 2px; margin-bottom: 4px;">${p.name}</h4>
                    <div style="font-size: 0.85rem; color: var(--charcoal-muted);">
                      🎓 ${p.level} • ⏱️ ${p.duration} • 💰 <strong style="color: var(--navy);">${p.totalFee}</strong>
                    </div>
                  </div>

                  <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                    <button class="btn btn-navy btn-sm" onclick="app.closeModal(); app.navigateToProgramme('${p.id}')">
                      View Programme Page
                    </button>
                    <button class="btn btn-secondary btn-sm" data-compare-id="${p.id}" onclick="app.compareManager.toggleCompareProgramme('${p.id}')">
                      + Add to Compare
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="app.toggleWishlist('${p.id}', 'programme'); app.openWishlistModal('programmes');">
                      Remove
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        ` : ''}
      </div>
    `;

    backdrop.classList.add('active');
  }

  /* ---------------------------------------------------- */
  /* PERSONALIZED DISCOVERY WIZARD MODAL RENDERER         */
  /* ---------------------------------------------------- */
  renderWizardModal(step = 1, wizardState = {}) {
    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = "Find My Direction — Personalized Discovery";
    }

    if (step === 1) {
      modalBody.innerHTML = `
        <div class="wizard-step-container">
          <div class="wizard-progress"><span style="width: 33%;">Step 1 of 3</span></div>
          <h2 style="font-size: 1.4rem; color: var(--navy); margin-bottom: 8px;">What is your current academic or professional stage?</h2>
          <p style="color: var(--charcoal-muted); font-size: 0.9rem; margin-bottom: 24px;">Select your background to filter relevant eligibility paths.</p>

          <div class="wizard-options-grid">
            <div class="wizard-opt-card" onclick="app.setWizardChoice('stage', 'Class 12th Student', 2)">
              <div class="opt-icon">🎓</div>
              <h3>After Class 12th / Diploma</h3>
              <p>Looking for Undergraduate degrees (BBA, BCA, B.Com, BA)</p>
            </div>
            <div class="wizard-opt-card" onclick="app.setWizardChoice('stage', 'College Graduate', 2)">
              <div class="opt-icon">📜</div>
              <h3>Recent Graduate</h3>
              <p>Looking for Postgraduate master degrees (MBA, MCA, M.Sc, M.Com)</p>
            </div>
            <div class="wizard-opt-card" onclick="app.setWizardChoice('stage', 'Working Professional', 2)">
              <div class="opt-icon">💼</div>
              <h3>Working Professional</h3>
              <p>Seeking career acceleration or Executive MBA / WILP degrees</p>
            </div>
          </div>
        </div>
      `;
    } else if (step === 2) {
      modalBody.innerHTML = `
        <div class="wizard-step-container">
          <div class="wizard-progress"><span style="width: 66%;">Step 2 of 3</span></div>
          <h2 style="font-size: 1.4rem; color: var(--navy); margin-bottom: 8px;">Which domain interests you most?</h2>
          <p style="color: var(--charcoal-muted); font-size: 0.9rem; margin-bottom: 24px;">Stage selected: <strong>${wizardState.stage}</strong></p>

          <div class="wizard-options-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
            <div class="wizard-opt-card" onclick="app.setWizardChoice('domain', 'Business & Management', 3)">
              <div class="opt-icon">💼</div>
              <h3>Business & Mgmt</h3>
            </div>
            <div class="wizard-opt-card" onclick="app.setWizardChoice('domain', 'Software & Technology', 3)">
              <div class="opt-icon">💻</div>
              <h3>Software & Tech</h3>
            </div>
            <div class="wizard-opt-card" onclick="app.setWizardChoice('domain', 'Data & AI', 3)">
              <div class="opt-icon">📊</div>
              <h3>Data & AI</h3>
            </div>
            <div class="wizard-opt-card" onclick="app.setWizardChoice('domain', 'Marketing & Growth', 3)">
              <div class="opt-icon">🚀</div>
              <h3>Marketing & Growth</h3>
            </div>
            <div class="wizard-opt-card" onclick="app.setWizardChoice('domain', 'Finance & Accounting', 3)">
              <div class="opt-icon">📈</div>
              <h3>Finance & Accounting</h3>
            </div>
          </div>
        </div>
      `;
    } else if (step === 3) {
      modalBody.innerHTML = `
        <div class="wizard-step-container">
          <div class="wizard-progress"><span style="width: 100%;">Step 3 of 3</span></div>
          <h2 style="font-size: 1.4rem; color: var(--navy); margin-bottom: 8px;">What matters most to you?</h2>
          <p style="color: var(--charcoal-muted); font-size: 0.9rem; margin-bottom: 24px;">Domain: <strong>${wizardState.domain}</strong></p>

          <div class="wizard-options-grid">
            <div class="wizard-opt-card" onclick="app.finishWizard('Career Growth')">
              <div class="opt-icon">🚀</div>
              <h3>Career Growth & Salary Jump</h3>
            </div>
            <div class="wizard-opt-card" onclick="app.finishWizard('Affordability & EMIs')">
              <div class="opt-icon">💰</div>
              <h3>Affordability & Flexible EMIs</h3>
            </div>
            <div class="wizard-opt-card" onclick="app.finishWizard('University Accreditation')">
              <div class="opt-icon">🏆</div>
              <h3>Top Accreditation & NAAC A+</h3>
            </div>
          </div>
        </div>
      `;
    }

    backdrop.classList.add('active');
  }

  /* ---------------------------------------------------- */
  /* INFORMATION REQUEST MODAL RENDERER                   */
  /* ---------------------------------------------------- */
  renderInfoRequestModal(title, sourceName) {
    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = `Get Information Packet — ${title}`;
    }

    modalBody.innerHTML = `
      <div style="max-width: 520px; margin: 0 auto; padding: 12px 0;">
        <div style="background: rgba(0, 90, 43, 0.05); padding: 16px; border-radius: var(--radius-sm); border-left: 4px solid var(--trust-green); margin-bottom: 24px;">
          <strong style="color: var(--navy);">Official Information Packet Request</strong>
          <p style="font-size: 0.85rem; color: var(--charcoal-muted); margin-top: 4px;">
            Request verified syllabus, fee structure, EMI breakdown, and eligibility details for ${title}.
          </p>
        </div>

        <form onsubmit="event.preventDefault(); app.handleInfoRequestSubmit(this, '${(title || 'Information Packet').replace(/'/g, "\\'")}');" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 6px;">Full Name *</label>
            <input type="text" name="name" id="infoReqName" required placeholder="e.g. Rahul Sharma" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--border-grey, #CBD5E1); border-radius: var(--radius-sm); font-size: 0.95rem; color: var(--navy);">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 6px;">Email Address *</label>
            <input type="email" name="email" id="infoReqEmail" required placeholder="rahul@example.com" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--border-grey, #CBD5E1); border-radius: var(--radius-sm); font-size: 0.95rem; color: var(--navy);">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 6px;">Mobile Phone Number *</label>
            <input type="tel" name="phone" id="infoReqPhone" required placeholder="+91 98765 43210" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--border-grey, #CBD5E1); border-radius: var(--radius-sm); font-size: 0.95rem; color: var(--navy);">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--navy); display: block; margin-bottom: 6px;">Current Qualification</label>
            <select name="qualification" id="infoReqQualification" style="width: 100%; padding: 12px 14px; border: 1.5px solid var(--border-grey, #CBD5E1); border-radius: var(--radius-sm); font-size: 0.95rem; color: var(--navy); background: #fff;">
              <option value="10+2 / High School">10+2 / High School</option>
              <option value="Bachelor's Degree Graduate" selected>Bachelor's Degree Graduate</option>
              <option value="Postgraduate Degree">Postgraduate Degree</option>
              <option value="Working Professional (3+ Yrs Exp)">Working Professional (3+ Yrs Exp)</option>
            </select>
          </div>

          <button class="btn btn-primary btn-lg" type="submit" id="downloadPacketBtn" style="margin-top: 12px; width: 100%; font-weight: 750;">
            Download Verified Information Packet
          </button>
          <div style="font-size: 0.75rem; color: var(--charcoal-muted); text-align: center;">
            🔒 NEXORA Privacy Guarantee: No spam, no aggressive telemarketing.
          </div>
        </form>
      </div>
    `;

    backdrop.classList.add('active');
  }

  /* Standard Modal Renderers for Compatibility */
  renderUniversityModal(univId) {
    this.renderFullUniversityPage(univId, document.getElementById('universityView'));
    window.app.showView('universityView');
  }

  renderProgrammeModal(progId) {
    this.renderFullProgrammePage(progId, document.getElementById('programmeView'));
    window.app.showView('programmeView');
  }

  /* ---------------------------------------------------- */
  /* COMPREHENSIVE PLATFORM POLICIES MODAL RENDERER      */
  /* ---------------------------------------------------- */
  renderPoliciesModal(activeTab = 'privacy') {
    const modalBody = document.getElementById('modalBodyContent');
    const modalTitle = document.getElementById('modalTitleText');
    const backdrop = document.getElementById('globalModalBackdrop');

    if (!modalBody || !backdrop) return;

    if (modalTitle) {
      modalTitle.textContent = 'NEXORA — Platform Policies & Statutory Guidelines';
    }

    modalBody.innerHTML = `
      <div style="max-width: 720px; margin: 0 auto; padding: 10px 0; color: #1E293B;">
        
        <!-- POLICY TAB NAVIGATION -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; border-bottom: 2px solid #E2E8F0; padding-bottom: 12px;">
          <button class="btn btn-sm ${activeTab === 'privacy' ? 'btn-primary' : 'btn-secondary'}" onclick="app.openPoliciesModal('privacy')">🔒 Privacy Policy</button>
          <button class="btn btn-sm ${activeTab === 'ugc' ? 'btn-primary' : 'btn-secondary'}" onclick="app.openPoliciesModal('ugc')">🏛️ UGC Compliance</button>
          <button class="btn btn-sm ${activeTab === 'refund' ? 'btn-primary' : 'btn-secondary'}" onclick="app.openPoliciesModal('refund')">💰 Fee &amp; Refund Policy</button>
          <button class="btn btn-sm ${activeTab === 'editorial' ? 'btn-primary' : 'btn-secondary'}" onclick="app.openPoliciesModal('editorial')">⚖️ Neutrality Policy</button>
          <button class="btn btn-sm ${activeTab === 'terms' ? 'btn-primary' : 'btn-secondary'}" onclick="app.openPoliciesModal('terms')">📜 Terms of Service</button>
        </div>

        <!-- POLICY CONTENT CONTAINERS -->
        ${activeTab === 'privacy' ? `
          <div style="line-height: 1.6;">
            <div style="background: #F0F7FF; border: 1px solid #BAE0FF; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 0.9rem; color: #004085;">
              <strong>🔒 Privacy &amp; Data Protection Policy:</strong> We protect student data with end-to-end encryption. Zero spam sales.
            </div>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">1. Information Collection &amp; Consent</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">We collect student data (Name, Email, Mobile, Educational Qualifications) strictly when requested to generate admission packets or route recommendations.</p>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">2. Data Routing &amp; Confidentiality</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">Data requested for specific university prospectuses is shared solely with that institution's authorized statutory counseling desk. NEXORA never sells user lead data to aggressive third-party telemarketing networks.</p>
          </div>
        ` : ''}

        ${activeTab === 'ugc' ? `
          <div style="line-height: 1.6;">
            <div style="background: rgba(0, 90, 43, 0.08); border: 1px solid rgba(0, 90, 43, 0.2); border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 0.9rem; color: #005A2B;">
              <strong>🏛️ UGC Statutory Recognition Policy:</strong> 100% Entitlement Transparency under Section 22 of the UGC Act 1956.
            </div>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">1. Degree Equivalence Gazette Notification</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">Under UGC Gazette Notifications (ODL &amp; Online Regulations), degrees awarded through online mode by entitled HEIs possess 100% academic parity with campus degrees for government jobs (UPSC, SSC, State PSCs) and global WES evaluation.</p>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">2. Ongoing Regulatory Audits</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">NEXORA regularly cross-checks Distance Education Bureau (DEB) statutory entitlement lists to ensure all listed HEIs hold active regulatory status.</p>
          </div>
        ` : ''}

        ${activeTab === 'refund' ? `
          <div style="line-height: 1.6;">
            <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 0.9rem; color: #795548;">
              <strong>💰 Statutory Fee &amp; Refund Mandate:</strong> Protection under UGC Admission Fee Refund Notifications.
            </div>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">1. Direct Fee Transparency</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">NEXORA displays statutory university tuition fees without hidden markups. All academic payments are processed directly to the official university portal.</p>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">2. Statutory UGC Refund Rules</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">Universities listed on NEXORA adhere to statutory UGC Refund Guidelines, allowing full/pro-rata fee refunds if admission cancellation is requested within statutory timelines prior to session commencement.</p>
          </div>
        ` : ''}

        ${activeTab === 'editorial' ? `
          <div style="line-height: 1.6;">
            <div style="background: #F3E5F5; border: 1px solid #E1BEE7; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 0.9rem; color: #4A148C;">
              <strong>⚖️ Platform Neutrality &amp; Editorial Policy:</strong> Objective, data-driven comparisons.
            </div>
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">1. Independent Comparative Scoring</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">University ratings, NAAC scores, and comparison outputs are calculated algorithmically based on statutory accreditations, curriculum currency, and verified learner reviews without sponsored bias.</p>
          </div>
        ` : ''}

        ${activeTab === 'terms' ? `
          <div style="line-height: 1.6;">
            <h3 style="font-size: 1.1rem; color: #001B66; margin-bottom: 8px;">Terms &amp; Conditions of Service</h3>
            <p style="font-size: 0.9rem; color: #475569; margin-bottom: 16px;">NEXORA functions as a student-first higher education discovery &amp; route navigation engine. Degree-granting authority rests solely with the accredited statutory universities.</p>
          </div>
        ` : ''}

        <div style="margin-top: 24px; text-align: center;">
          <button class="btn btn-primary btn-md" onclick="document.getElementById('globalModalBackdrop').classList.remove('active')">
            Close Policy Center
          </button>
        </div>
      </div>
    `;

    backdrop.classList.add('active');
  }

  /* ---------------------------------------------------- */
  /* TERMS & CONDITIONS, PRIVACY & UGC DISCLAIMER MODALS   */
  /* ---------------------------------------------------- */
  renderTermsModal() {
    this.renderPoliciesModal('terms');
  }

  renderPrivacyModal() {
    this.renderPoliciesModal('privacy');
  }

  renderUgcDisclaimerModal() {
    this.renderPoliciesModal('ugc');
  }
}

window.ViewRenderers = ViewRenderers;

