let cvData = {
    personal: {},
    summary: '',
    work: [],
    education: [],
    skills: '',
    languages: '',
    certifications: '',
    awards: '',
    template: 1,
    language: 'ID',
    photo: null // Tambah photo
};

/* ================= PHOTO HANDLING ================= */
function initPhotoUpload() {
    const photoInput = document.getElementById('photo');
    const preview = document.getElementById('photoPreview');
    
    photoInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Resize to 3x4 (90x120px for preview)
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 90;
                    canvas.height = 120;
                    ctx.drawImage(img, 0, 0, 90, 120);
                    
                    preview.innerHTML = `<img src="${canvas.toDataURL()}" class="photo-preview-img">`;
                    cvData.photo = canvas.toDataURL(); // Base64
                    saveData();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Load preview jika ada foto tersimpan
    if (cvData.photo) {
        preview.innerHTML = `<img src="${cvData.photo}" class="photo-preview-img">`;
    }
}

/* ================= LOCAL STORAGE ================= */
function saveData() {
    localStorage.setItem('cvData', JSON.stringify(cvData));
}

function loadData() {
    const saved = localStorage.getItem('cvData');
    if (saved) {
        cvData = JSON.parse(saved);
        populateForm();
    }
}

/* ================= FORM POPULATE ================= */
function populateForm() {
    document.getElementById('name').value = cvData.personal.name || '';
    document.getElementById('phone').value = cvData.personal.phone || '';
    document.getElementById('email').value = cvData.personal.email || '';
    document.getElementById('website').value = cvData.personal.website || '';

    document.getElementById('summary').value = cvData.summary || '';
    document.getElementById('skills').value = cvData.skills || '';
    document.getElementById('languages').value = cvData.languages || '';
    document.getElementById('certifications').value = cvData.certifications || '';
    document.getElementById('awards').value = cvData.awards || '';
}

// Sisanya sama...
function savePersonalData() {
    cvData.personal.name = document.getElementById('name').value;
    cvData.personal.phone = document.getElementById('phone').value;
    cvData.personal.email = document.getElementById('email').value;
    cvData.personal.website = document.getElementById('website').value;
    cvData.summary = document.getElementById('summary').value;
}

function saveAdditionalData() {
    cvData.skills = document.getElementById('skills').value;
    cvData.languages = document.getElementById('languages').value;
    cvData.certifications = document.getElementById('certifications').value;
    cvData.awards = document.getElementById('awards').value;
    saveData();
}

function saveDataAndGo(page) {
    savePersonalData();
    saveAdditionalData();
    window.location.href = page;
}

// Dynamic forms sama persis...
function initDynamicForms() {
    document.getElementById('addWork').onclick = () =>
        addSection('workExperiences', renderWork, cvData.work);

    document.getElementById('addEducation').onclick = () =>
        addSection('educations', renderEducation, cvData.education);

    renderList('workExperiences', renderWork, cvData.work);
    renderList('educations', renderEducation, cvData.education);
}

function renderList(container, renderFn, list) {
    const el = document.getElementById(container);
    el.innerHTML = '';
    list.forEach((item, i) => {
        el.appendChild(renderFn(item, i));
    });
}

function addSection(container, renderFn, list) {
    list.push({});
    renderList(container, renderFn, list);
    saveData();
}

function renderWork(item, i) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <input placeholder="Perusahaan" value="${item.company || ''}" onchange="cvData.work[${i}].company=this.value;saveData()">
        <input placeholder="Jabatan" value="${item.title || ''}" onchange="cvData.work[${i}].title=this.value;saveData()">
        <input placeholder="Tahun (2022-2024)" value="${item.years || ''}" onchange="cvData.work[${i}].years=this.value;saveData()">
        <textarea rows="3" placeholder="Deskripsi (bullet points)" onchange="cvData.work[${i}].desc=this.value;saveData()">${item.desc || ''}</textarea>
        <button type="button" class="btn-secondary" onclick="cvData.work.splice(${i}, 1);renderList('workExperiences', renderWork, cvData.work);saveData();">🗑️ Hapus</button>
    `;
    return div;
}

function renderEducation(item, i) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.innerHTML = `
        <input placeholder="Jurusan" value="${item.major || ''}" onchange="cvData.education[${i}].major=this.value;saveData()">
        <input placeholder="Universitas" value="${item.university || ''}" onchange="cvData.education[${i}].university=this.value;saveData()">
        <input placeholder="Tahun" value="${item.years || ''}" onchange="cvData.education[${i}].years=this.value;saveData()">
        <button type="button" class="btn-secondary" onclick="cvData.education.splice(${i}, 1);renderList('educations', renderEducation, cvData.education);saveData();">🗑️ Hapus</button>
    `;
    return div;
}
