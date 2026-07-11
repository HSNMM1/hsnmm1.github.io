// Description: This file contains the configuration for the resume page.
//
import { computeCompanyTenure, getInitials, roleDuration } from './experienceUtils.js';
import { marked } from './marked.esm.js';

function buildCompanyLogo(experience) {
	const logoWrap = document.createElement('div');
	logoWrap.classList.add('company-logo');

	if (experience.logoBackground) {
		logoWrap.style.backgroundColor = experience.logoBackground;
	}

	if (experience.logo) {
		const img = document.createElement('img');
		img.src = experience.logo;
		img.alt = `${experience.organization} logo`;
		img.loading = 'lazy';
		img.addEventListener('error', () => {
			logoWrap.innerHTML = '';
			logoWrap.classList.add('company-logo-fallback');
			const initials = document.createElement('span');
			initials.classList.add('company-logo-initials');
			initials.textContent = getInitials(experience.organization);
			logoWrap.appendChild(initials);
		});
		logoWrap.appendChild(img);
	} else {
		logoWrap.classList.add('company-logo-fallback');
		const initials = document.createElement('span');
		initials.classList.add('company-logo-initials');
		initials.textContent = getInitials(experience.organization);
		logoWrap.appendChild(initials);
	}
	return logoWrap;
}

function buildRoleItem(role, organizationName) {
	const item = document.createElement('li');
	item.classList.add('role-item');

	const marker = document.createElement('span');
	marker.classList.add('role-marker');
	marker.setAttribute('aria-hidden', 'true');
	item.appendChild(marker);

	const content = document.createElement('div');
	content.classList.add('role-content');

	const title = document.createElement('h4');
	title.classList.add('role-title');
	title.textContent = role.title;
	content.appendChild(title);

	const meta = document.createElement('p');
	meta.classList.add('role-meta');
	const date = document.createElement('span');
	date.classList.add('role-date');
	date.textContent = role.date;
	meta.appendChild(date);

	const duration = roleDuration(role);
	if (duration) {
		const sep = document.createElement('span');
		sep.classList.add('role-sep');
		sep.setAttribute('aria-hidden', 'true');
		sep.textContent = '·';
		meta.appendChild(sep);
		const dur = document.createElement('span');
		dur.classList.add('role-duration');
		dur.textContent = duration;
		meta.appendChild(dur);
	}

	if (role.location) {
		const sep = document.createElement('span');
		sep.classList.add('role-sep');
		sep.setAttribute('aria-hidden', 'true');
		sep.textContent = '·';
		meta.appendChild(sep);
		const loc = document.createElement('span');
		loc.classList.add('role-location');
		loc.textContent = role.location;
		meta.appendChild(loc);
	}
	content.appendChild(meta);

	if (role.description && role.description.length) {
		const ul = document.createElement('ul');
		ul.classList.add('responsibilities');
		role.description.forEach((line) => {
			const li = document.createElement('li');
			li.innerHTML = line;
			ul.appendChild(li);
		});
		content.appendChild(ul);
	}

	item.appendChild(content);

	if (role.media) {
		const media = document.createElement('div');
		media.classList.add('role-media');
		const carouselId = `carousel-${slugify(role.title)}`;
		media.innerHTML = `
				${role.media
					.map(
						(mediaUrl, index) => `
						<a class="role-media-link" data-bs-toggle="modal" data-bs-target="#experience-media-modal" data-title="${organizationName}" data-media-src="${mediaUrl}">
							<div class="role-media-container">
								<img src="${mediaUrl}" loading="lazy" class="role-image" alt="Photo of the role ${role.title} in ${organizationName}">
								<small class="role-media-footer">${lang === 'en' ? 'Certificate' : 'گواهی'}
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
										<path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
										<path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
									</svg>
								</small>
							</div>
						</a>`,
					)
					.join('')}`;
		item.appendChild(media);
	}

	return item;
}

function buildCompanyCard(experience) {
	const card = document.createElement('article');
	card.classList.add('company-card', 'resume-item');

	const header = document.createElement('header');
	header.classList.add('company-header');
	header.appendChild(buildCompanyLogo(experience));

	const info = document.createElement('div');
	info.classList.add('company-info');

	const name = document.createElement('h3');
	name.classList.add('company-name');
	name.textContent = experience.organization;
	info.appendChild(name);

	const tenure = computeCompanyTenure(experience.roles || []);
	if (tenure) {
		const tenureEl = document.createElement('p');
		tenureEl.classList.add('company-tenure');
		tenureEl.textContent = tenure;
		info.appendChild(tenureEl);
	}

	header.appendChild(info);
	card.appendChild(header);

	const timeline = document.createElement('ol');
	timeline.classList.add('role-timeline');
	(experience.roles || []).forEach((role) => {
		timeline.appendChild(buildRoleItem(role, experience.organization));
	});
	if ((experience.roles || []).length <= 1) {
		timeline.classList.add('role-timeline-single');
	}
	card.appendChild(timeline);

	return card;
}

function slugify(str) {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function showMainView() {
	document.getElementById('main-view').classList.remove('d-none');
	document.getElementById('detail-view').classList.add('d-none');
}

function showDetailView(project) {
	document.getElementById('main-view').classList.add('d-none');
	document.getElementById('detail-view').classList.remove('d-none');

	renderDetail(project);
}

window.addEventListener('popstate', (event) => {
	const state = event.state;
	if (!state?.page) {
		showMainView();
		return;
	} else {
		history.pushState({}, '', '/');
	}

	// if (state.page === 'detail') {
	// 	showDetailView(state.itemId);
	// }
});

function renderDetail(project) {
	const mediaContainer = document.querySelector('#project-carousel > .carousel-inner');
	project.media.forEach((url, index) => {
		const el = document.createElement('div');
		el.classList.add('carousel-item');
		if (index === 0) el.classList.add('active');

		el.innerHTML = `<img src="${url}" class="d-block w-100" loading="lazy" alt="${project.name} Media">`;
		mediaContainer.appendChild(el);
	});

	document.getElementById('detail-title').textContent = project.name;
	document.getElementById('detail-year').textContent = project.year;
	document.getElementById('detail-location').textContent = project.location;
	document.getElementById('detail-client').textContent = project.client;
	document.getElementById('detail-role').textContent = project.role;
	document.getElementById('detail-content').innerHTML = marked(project.detail);
	document.getElementById('close-detail').addEventListener('click', () => {
		showMainView();
		document
			.querySelector(`.portfolio-item[data-project-id="${project.id}"]`)
			.scrollIntoView({ behavior: 'instant', block: 'center' });
		history.pushState({}, '', '/');
	});
}

function buildPortfolioCard(project) {
	const portfolioItem = document.createElement('div');
	portfolioItem.classList.add('portfolio-item');
	portfolioItem.setAttribute('data-project-id', project.id);

	const imageContainer = document.createElement('div');
	imageContainer.classList.add('portfolio-image-container');
	const img = document.createElement('img');
	img.src = project.image;
	img.alt = `${project.name} image`;
	img.classList.add('portfolio-image');
	img.loading = 'lazy';
	img.style.objectPosition = `0 ${project.position}`;
	imageContainer.appendChild(img);

	const description = document.createElement('div');
	description.classList.add(
		'portfolio-description',
		'd-flex',
		'flex-column',
		'justify-content-between',
		'align-items-start',
	);
	const header = document.createElement('div');
	header.classList.add('portfolio-header', 'justify-content-between');
	const detail = document.createElement('div');
	detail.classList.add('d-flex', 'flex-column', 'gap-2', 'align-items-start');

	const name = document.createElement('h3');
	name.classList.add('portfolio-title');
	name.textContent = project.name;
	const date = document.createElement('span');
	date.classList.add('small');
	date.textContent = project.date;
	header.appendChild(name);
	header.appendChild(date);

	const role = document.createElement('span');
	role.classList.add(
		'border',
		'border-1',
		'rounded-pill',
		'px-3',
		'py-1',
		'text-bg-light',
		'fw-bold',
	);
	role.textContent = project.role;
	const descriptionBody = document.createElement('p');
	descriptionBody.classList.add('m-0');
	descriptionBody.textContent = project.description;
	detail.appendChild(role);
	detail.appendChild(descriptionBody);

	description.appendChild(header);
	description.appendChild(detail);

	portfolioItem.appendChild(imageContainer);
	portfolioItem.appendChild(description);

	portfolioItem.onclick = (e) => {
		const itemId = project.id;

		history.pushState(
			{
				page: 'project-detail',
				itemId,
			},
			'',
			`#project-${slugify(project.name)}`,
		);

		showDetailView(project);
		window.scrollTo({
			top: window.top,
			behavior: 'smooth',
		});
	};

	return portfolioItem;
}

function buildClientsSlider(clients, containerWidth) {
	const minWidth = containerWidth / clients.length;
	const clientsSlider = document.createElement('div');
	clientsSlider.classList.add('slide-track');
	clients.forEach((client) => {
		const clientSlide = document.createElement('div');
		clientSlide.classList.add('slide');
		clientSlide.innerHTML = `<img src="${client.logo}" class="" height="100" width="100" loading="lazy" alt="${client.name}" /><span class="client-name">${client.name}</span>`;
		clientSlide.style.minWidth = `${minWidth}px`;
		clientsSlider.appendChild(clientSlide);
	});
	clientsSlider.append(...Array.from(clientsSlider.children).map((node) => node.cloneNode(true)));
	return clientsSlider;
}

function buildJourneyItem(item) {
	const itemEl = document.createElement('div');
	itemEl.classList.add('journey-item');
	itemEl.role = 'listitem';
	const container = document.createElement('div');
	container.classList.add(
		'journey-item-container',
		'border',
		'border-1',
		// 'rounded-top-0',
		'rounded-4',
	);

	const headerEl = document.createElement('div');
	headerEl.classList.add('journey-header');
	headerEl.textContent = `${lang === 'en' ? 'Projects in' : 'پروژه‌های'} ${item.date}`;
	container.appendChild(headerEl);

	const contentEl = document.createElement('div');
	contentEl.classList.add(
		'journey-content',
		// 'py-3',
		// 'px-4',
		// 'border',
		// 'border-1',
		// 'rounded-4',
	);

	// const title = document.createElement('h3');
	// title.classList.add('journey-title');
	// title.textContent = item.title;
	// contentEl.appendChild(title);

	const desUl = document.createElement('ul');
	desUl.classList.add('journey-ul', 'm-0');
	item.content.forEach((line) => {
		const li = document.createElement('li');
		li.classList.add('journey-li');
		li.textContent = line;
		desUl.appendChild(li);
	});
	contentEl.appendChild(desUl);
	container.appendChild(contentEl);

	// const imgEl = document.createElement('img');
	// imgEl.classList.add('journey-img');
	// imgEl.height = '100px';
	// imgEl.src = item.img;
	// container.appendChild(imgEl);

	itemEl.appendChild(container);

	return itemEl;
}

function buildServiceItem(service) {
	const itemEl = document.createElement('div');
	itemEl.classList.add('service-item');
	itemEl.role = 'listitem';

	const titleEl = document.createElement('h5');
	titleEl.classList.add('service-title');
	titleEl.textContent = service.title;
	itemEl.appendChild(titleEl);

	const imgContainer = document.createElement('div');
	imgContainer.classList.add('service-img-container');
	itemEl.appendChild(imgContainer);

	const imgEl = document.createElement('img');
	imgEl.classList.add('service-img');
	imgEl.height = 160;
	imgEl.src = service.img;
	imgEl.loading = 'lazy';
	imgContainer.appendChild(imgEl);

	return itemEl;
}

let lang = 'en';
export async function loadConfig(selectedLang) {
	if (document.readyState === 'loading') {
		await new Promise((resolve) =>
			document.addEventListener('DOMContentLoaded', resolve, { once: true }),
		);
	}

	const response = await fetch(`public/config-${selectedLang}.json`);
	const data = await response.json();
	lang = selectedLang;

	const bioSection = document.getElementById('bio-section');
	bioSection.innerHTML = data.personal_info.bio;

	const portfolioGrid = document.getElementById('portfolio-grid');
	portfolioGrid.innerHTML = '';
	data.projects.forEach((project) => {
		portfolioGrid.appendChild(buildPortfolioCard(project));
	});

	// Generate Skills Section
	const skillsSection = document.getElementById('skills-section');
	skillsSection.innerHTML = '';
	data.skills.forEach((skill) => {
		const skillItem = document.createElement('div');
		skillItem.classList.add('resume-item', 'd-flex', 'gap-2', 'align-items-center', 'col-auto');

		// const skillIcon = document.createElement('img');
		// skillIcon.classList.add('skill-icon', 'rounded-3');
		// skillIcon.width = '32';
		// skillIcon.height = '32';
		// skillIcon.src = `${skill.icon}`;

		const skillName = document.createElement('h4');
		skillName.classList.add(
			'skill-header',
			'border',
			'border-1',
			'rounded-pill',
			'm-0',
			'py-2',
			'px-3',
		);
		skillName.textContent = `${skill}`;

		// skillItem.appendChild(skillIcon);
		skillItem.appendChild(skillName);

		skillsSection.appendChild(skillItem);
	});

	// Generate Education Section
	const educationSection = document.getElementById('education-section');
	educationSection.innerHTML = '';
	data.education.forEach((item) => {
		const educationItem = document.createElement('div');
		educationItem.classList.add('resume-item');

		const header = document.createElement('div');
		header.classList.add(
			'd-flex',
			'flex-column',
			'flex-sm-row',
			'justify-content-between',
			'align-items-start',
			'align-items-sm-center',
			'mb-1',
		);
		const degree = document.createElement('h4');
		degree.classList.add('degree', 'fs-6', 'm-0');
		degree.textContent = item.degree;
		const date = document.createElement('p');
		date.classList.add('date-range', 'm-0');
		date.textContent = item.date;
		header.appendChild(degree);
		header.appendChild(date);

		const field = document.createElement('div');
		field.classList.add(
			'resume-header',
			'd-flex',
			'justify-content-start',
			'align-items-center',
			'lh-1',
			'mb-2',
		);
		field.textContent = item.field;

		const institutionDetails = document.createElement('div');
		institutionDetails.classList.add(
			'd-flex',
			'flex-column',
			'flex-sm-row',
			'justify-content-between',
			'align-items-start',
			'align-items-sm-center',
		);
		const institution = document.createElement('p');
		institution.classList.add('company-details', 'mb-0');
		institution.textContent = item.university;
		const location = document.createElement('p');
		location.classList.add('location');
		location.textContent = item.location;
		institutionDetails.appendChild(institution);
		institutionDetails.appendChild(location);

		educationItem.appendChild(header);
		educationItem.appendChild(field);
		educationItem.appendChild(institutionDetails);

		if (item.achivements) {
			const achivementsEl = document.createElement('div');
			achivementsEl.classList.add('education-achivements', 'mb-2');
			const achivementsHeader = document.createElement('h5');
			achivementsHeader.classList.add('w-100', 'm-0', 'mt-2', 'fw-bold');
			achivementsHeader.textContent = lang === 'en' ? 'Achivements' : 'دستاوردها';
			achivementsEl.appendChild(achivementsHeader);
			item.achivements.forEach((achivement) => {
				const achivementEl = document.createElement('div');
				achivementEl.classList.add('education-achivement');
				achivementEl.innerHTML = `
					<a class="education-media-link" data-bs-toggle="modal" data-bs-target="#education-media-modal" data-title="${achivement.title}" data-media-src="${achivement.media}">
						<div class="education-media-container">
							<img src="${achivement.media}" loading="lazy" class="education-image" alt="${achivement.title} Certification Picture">
							<p class="education-media-footer">${achivement.title}</p>
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="education-achivement-svg bi bi-box-arrow-up-right" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
								<path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
							</svg>
						</div>
					</a>`;
				achivementsEl.appendChild(achivementEl);
			});
			educationItem.appendChild(achivementsEl);
		}

		educationSection.appendChild(educationItem);
	});

	// Generate Experience Section (grouped by company)
	const experiencesSection = document.getElementById('experiences-section');
	experiencesSection.innerHTML = '';
	data.experiences.forEach((experience) => {
		experiencesSection.appendChild(buildCompanyCard(experience));
	});

	// const journeySection = document.getElementById('journey');
	// data.journey.forEach((item) => {
	// 	const itemEl = document.createElement('div');
	// 	itemEl.classList.add('journey-item');
	// 	const container = document.createElement('div');
	// 	container.classList.add('journey-container', 'py-3', 'px-4', 'border', 'border-1', 'rounded-4');

	// 	const title = document.createElement('h4');
	// 	title.classList.add('journey-title');
	// 	title.textContent = item.title;
	// 	container.appendChild(title);

	// 	const list = document.createElement('ul');
	// 	list.classList.add('journey-ul', 'responsibilities');
	// 	item.content.forEach((line) => {
	// 		const li = document.createElement('li');
	// 		li.classList.add('journey-li');
	// 		li.textContent = line;
	// 		list.appendChild(li);
	// 	});
	// 	container.appendChild(list);

	// 	itemEl.appendChild(container);

	// 	journeySection.appendChild(itemEl);
	// });

	const journeySection = document.getElementById('journey-list');
	journeySection.innerHTML = '';
	data.journey.forEach((item) => {
		journeySection.appendChild(buildJourneyItem(item));
	});

	const servicesUl = document.getElementById('services-ul');
	servicesUl.innerHTML = '';
	data.services.forEach((service) => {
		servicesUl.appendChild(buildServiceItem(service));
	});

	const clientsSlider = document.getElementById('clients-slider');
	clientsSlider.innerHTML = '';
	const clientsSliderWidth = clientsSlider.offsetWidth;
	for (let i = 0; i < Math.ceil(data.clients.length / 15); i++) {
		const start = i * 15;
		clientsSlider.appendChild(
			buildClientsSlider(data.clients.slice(start, start + 15), clientsSliderWidth),
		);
	}
	// clientsSlider.style.width = `${150 * data.clients.length}px`;
}
