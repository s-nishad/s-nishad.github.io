function loadAboutSection() {
  fetch('data/about.json')
    .then(response => response.json())
    .then(data => {
      // Load about text
      const aboutSection = document.querySelector('[data-page="about"] .about-text');
      aboutSection.innerHTML = `
          <p>${data.about.intro}</p>
          ${data.about.description.map(para => `<p>${para}</p>`).join('')}
        `;

      // Load services
      const servicesSection = document.querySelector('[data-page="about"] .service-list');
      servicesSection.innerHTML = data.about.services.map(service => `
          <li class="service-item">
            <div class="service-icon-box">
              <img src="${service.icon}" alt="${service.title.toLowerCase()} icon" width="40">
            </div>
            <div class="service-content-box">
              <h4 class="h4 service-item-title">${service.title}</h4>
              <p class="service-item-text">${service.description}</p>
            </div>
          </li>
        `).join('');
    })
    .catch(error => console.error('Error loading about data:', error));
}

function loadExperience() {
  fetch('data/experience.json')
    .then(response => response.json())
    .then(data => {
      const timelineSection = document.querySelector('.timeline');
      let html = '';

      data.experiences.forEach((company, index) => {
        // Company header with icon
        html += `
          <div class="title-wrapper">
            <div class="icon-box">
              <ion-icon name="briefcase-outline"></ion-icon>
            </div>
            <h3 class="h3 company-name">${company.company}</h3>
          </div>

          <ol class="timeline-list">
        `;

        // Jobs under this company
        company.jobs.forEach(job => {
          html += `
            <li class="timeline-item">
              <div class="item-head">
                <h4 class="h4 timeline-item-title">${job.title}</h4>
                <span>${job.duration}</span>
              </div>
              <span class="ex-loc">${job.location}</span>
              <p class="timeline-text">${job.description}</p>
            </li>
          `;
        });

        html += `</ol>`;

        // Add divider (except after last company)
        if (index < data.experiences.length - 1) {
          html += `<hr class="divider">`;
        }
      });

      timelineSection.innerHTML = html;
    })
    .catch(error => console.error("Error loading experience data:", error));
}


// Add this after your experience section code
function loadEducation() {
  fetch('data/education.json')
    .then(response => response.json())
    .then(data => {
      const eduTimeline = document.querySelector('.edu-timeline-list');
      let html = '';

      data.education.forEach(edu => {
        html += `
            <li class="edu-timeline-item">
              <div class="edu-item-head">
                <h4 class="h4 edu-timeline-item-title">${edu.institution}</h4>
                <span>${edu.duration}</span>
              </div>
              <div class="edu-item-head">
                <h4 class="h4 edu-timeline-item-title major">${edu.degree}</h4>
                <span class="major">${edu.result}</span>
              </div>
              <p class="edu-timeline-text">${edu.description}</p>
            </li>
          `;
      });

      eduTimeline.innerHTML = html;
    })
    .catch(error => console.error("Error loading education data:", error));
}

function loadCertificate() {
  fetch('data/certificates.json')
    .then(response => response.json())
    .then(data => {
      const certSlider = document.querySelector('.slider');
      const dotsContainer = document.getElementById('dots');
      let html = '';

      data.certificates.forEach(cert => {
        html += `
          <div class="slide">
            <a class="venobox" data-gall="certificates" href="${cert.image}" data-title="${cert.title}">
              <img src="${cert.image}" alt="${cert.title}">
            </a>
          </div>
        `;
      });

      certSlider.innerHTML = html;

      const slides = document.querySelectorAll('.slide');
      let index = 0;
      const slidesPerPage = window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 2 : 4;
      const totalPages = Math.ceil(slides.length / slidesPerPage);

      // Create dots
      dotsContainer.innerHTML = ''; // Clear existing dots
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('span');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsContainer.appendChild(dot);
      }
      const dots = dotsContainer.querySelectorAll('span');
      if (dots.length > 0) dots[0].classList.add('active');

      function moveToSlide(i) {
        index = i;
        certSlider.style.transform = `translateX(-${i * 50}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        dots[i].classList.add('active');
      }

      // Optional: Auto-slide every 5s
      setInterval(() => {
        index = (index + 1) % totalPages;
        moveToSlide(index);
      }, 5000);

      if (typeof VenoBox !== 'undefined') {
        new VenoBox({
          selector: '.venobox',
          infinigall: true,
          spinner: 'rotating-plane',
          numeration: true,
          titleattr: 'data-title',
        });
      }
    })
    .catch(error => console.error("Error loading certificate data:", error));
}


function loadSkills() {
  fetch('data/skills.json')
    .then(response => response.json())
    .then(data => {
      const techBadgesSection = document.querySelector('.tech-badges');
      let html = '';

      data.skillCategories.forEach(category => {
        html += `
            <h3 class="h3 skills-title">${category.title}</h3>
            <div class="badge-container">
          `;

        category.skills.forEach(skill => {
          html += `
              <img src="${skill.badgeUrl}" alt="${skill.name}">
            `;
        });

        html += `</div>`;
      });

      techBadgesSection.innerHTML = html;
    })
    .catch(error => console.error("Error loading skills data:", error));
}

function setupFiltering() {
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const projectItems = document.querySelectorAll('.project-item');
  const selectValue = document.querySelector('[data-selecct-value]'); // typo in 'selecct'

  function filterProjects(category) {
    projectItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (category === 'all' || category === itemCategory) {
        item.classList.add('active');
        item.style.display = '';
      } else {
        item.classList.remove('active');
        item.style.display = 'none';
      }
    });
  }

  // Button filters (for desktop)
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.textContent.toLowerCase();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(category);
    });
  });

  // Dropdown filters (for mobile)
  selectItems.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.textContent.toLowerCase();
      if (selectValue) selectValue.textContent = item.textContent;
      filterProjects(category);
    });
  });
}


function loadProjects() {
  fetch('data/project.json')
    .then(response => response.json())
    .then(data => {
      const projectList = document.querySelector('.project-list');
      let html = '';

      data.projects.forEach(project => {
        html += `
          <li class="project-item active" data-filter-item data-category="${project.category}">
            <a href="${project.detailsUrl}" data-fancybox data-type="iframe">
              <figure class="project-img">
                <div class="project-item-icon-box">
                  <ion-icon name="eye-outline"></ion-icon>
                </div>
                <img src="${project.image}" alt="${project.title}" loading="lazy">
              </figure>
              <h3 class="project-title">${project.title}</h3>
              <p class="project-category">${project.description}</p>
            </a>
          </li>
        `;
      });

      projectList.innerHTML = html;
      setupFiltering(); // Call the filtering setup function after loading projects
    })
    .catch(error => console.error("Error loading projects data:", error));
}



// Add this function to load blog posts
function loadBlogPosts() {
  fetch('data/blog.json')
    .then(response => response.json())
    .then(data => {
      const blogList = document.querySelector('.blog-posts-list');
      blogList.innerHTML = '';

      data.posts.forEach(post => {
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        const postItem = document.createElement('li');
        postItem.className = 'blog-post-item';

        postItem.innerHTML = `
            <a href="${post.url}" target="_blank">
              <figure class="blog-banner-box">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
              </figure>
              <div class="blog-content">
                <div class="blog-meta">
                  <p class="blog-category">${post.category}</p>
                  <span class="dot"></span>
                  <time datetime="${post.date}">${formattedDate}</time>
                </div>
                <h3 class="h3 blog-item-title">${post.title}</h3>
                <p class="blog-text">${post.excerpt}</p>
              </div>
            </a>
          `;

        blogList.appendChild(postItem);
      });
    })
    .catch(error => console.error('Error loading blog posts:', error));
}

function loadResearch() {
  fetch('data/research.json')
    .then(response => response.json())
    .then(data => {
      const timelineSection = document.querySelector('.research .timeline');
      timelineSection.innerHTML = ''; // Clear existing content

      data.research.forEach((research, index) => {
        // Create research project element
        const researchProject = document.createElement('div');
        researchProject.innerHTML = `
          <div class="title-wrapper">
            <div class="icon-box">
              <ion-icon name="${research.icon}"></ion-icon>
            </div>
            <h3 class="h3">${research.title}</h3>
          </div>

          <ol class="timeline-list">
            <li class="timeline-item">
              <div class="timeline-item-head">
                <span class="timeline-duration">${research.duration}</span>
                <span class="timeline-location">${research.location}</span>
              </div>
              <div class="timeline-content">
                <p class="timeline-text">${research.description}</p>
                <div class="research-tags">
                  ${research.tags.map(tag => `<span class="tag-item">${tag}</span>`).join('')}
                </div>
                <div class="doi-link">
                  Dataset DOI: <a href="${research.dataset_doi.url}" target="_blank" rel="noopener">${research.dataset_doi.text}</a>
                </div>
                <div class="doi-link">
                  Journal DOI: <a href="${research.journal_doi.url}" target="_blank" rel="noopener">${research.journal_doi.text}</a>
                </div>
              </div>
            </li>
          </ol>
        `;

        timelineSection.appendChild(researchProject);

        // Add divider between projects (except after last one)
        if (index < data.research.length - 1) {
          const divider = document.createElement('hr');
          divider.className = 'divider';
          timelineSection.appendChild(divider);
        }
      });

      // Initialize ion-icons (if not already loaded)
      if (window.ionicons) {
        ionicons.refresh();
      }
    })
    .catch(error => console.error('Error loading research data:', error));
}





// Call this with your other loaders
document.addEventListener('DOMContentLoaded', function () {
  loadAboutSection();
  loadExperience();
  loadEducation();
  loadSkills();
  loadBlogPosts();
  loadResearch();
  loadCertificate();
  loadProjects();
});
