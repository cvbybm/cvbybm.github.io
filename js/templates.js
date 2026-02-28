const TRANSLATIONS = {
    ID: {
        summary: 'RINGKASAN PROFIL',
        work: 'PENGALAMAN KERJA',
        education: 'PENDIDIKAN',
        skills: 'KEAHLIAN TEKNIK',
        languages: 'BAHASA',
        certifications: 'SERTIFIKASI',
        awards: 'PENGHARGAAN',
        additional: 'INFORMASI TAMBAHAN'  // TAMBAH INI
    },
    EN: {
        summary: 'PROFESSIONAL SUMMARY',
        work: 'WORK EXPERIENCE',
        education: 'EDUCATION',
        skills: 'TECHNICAL SKILLS',
        languages: 'LANGUAGES',
        certifications: 'CERTIFICATIONS',
        awards: 'AWARDS',
        additional: 'ADDITIONAL INFORMATION'  // TAMBAH INI
    }
};

function generatePreview() {
    const data = window.cvData;
    const lang = data.language || 'ID';
    const t = TRANSLATIONS[lang];
    const preview = document.getElementById('cvPreview');

    if (!data.personal?.name) {
        preview.innerHTML = `
            <p style="text-align:center;color:#999;font-size:18px;margin-top:50px;">
            ⚠️ Isi form dulu untuk melihat preview!
            </p>
        `;
        return;
    }

    let html = `
        <div style="
            max-width:210mm;
            margin:0 auto;
            padding:40px 30px;
            background:white;
            font-family:Arial,sans-serif;
            font-size:11pt;
            line-height:1.5;
            color:#000;
            min-height:297mm;
            box-sizing:border-box;
        ">
    `;

    /* ========== HEADER ========== */
    if (data.template === 1) {
        html += generateHeaderTemplate1(data);
    } else {
        html += generateHeaderTemplate2(data);
    }

    /* ================= SUMMARY ================= */
    if (data.summary) {
        html += generateSectionTitle(t.summary);
        html += `<div style="text-align:justify; margin-bottom:20px;">${data.summary.replace(/\n/g, '<br>')}</div>`;
    }

    /* ========== WORK & EDUCATION ========== */
    html += generateWorkSection(t.work, data.work);
    html += generateEducationSection(t.education, data.education);

    /* ========== INFORMASI TAMBAHAN ========== */
    html += generateAdditionalInfoSection(t, data);

    

    preview.innerHTML = html;
}

/* ================= HEADER FUNCTIONS ================= */
function generateHeaderTemplate1(data) {
    return `
        <div style="text-align:center; margin-bottom:20px;">
            <h1 style="font-size:26pt; font-weight:bold; margin:0 0 8px; color:#2d3748; text-transform:uppercase;">
                ${data.personal.name}
            </h1>
            <p style="font-size:11pt; color:#4a5568; margin:0 0 15px;">
                ${[data.personal.phone, data.personal.email, data.personal.website].filter(Boolean).join(' | ')}
            </p>
            <div style="border-bottom:3px solid #000; width:100%;"></div>
        </div>
    `;
}

function generateHeaderTemplate2(data) {
    const hasPhoto = data.photo;
    const contacts = [data.personal.phone, data.personal.email, data.personal.website].filter(Boolean);
    
    return `
        <div style="display:flex; align-items:flex-start; gap:15px; margin-bottom:25px; border-bottom:2px solid #000; padding-bottom:15px;">
            ${hasPhoto ? `
                <div style="flex-shrink:0;">
                    <img src="${data.photo}" style="
                        width:28mm; 
                        height:38mm; 
                        object-fit:cover; 
                        border:1px solid #ddd; 
                        border-radius:3px;
                    " alt="Photo">
                </div>
            ` : ''}
            <div style="flex:1; min-width:0;">
                <h1 style="
                    font-size:24pt; 
                    font-weight:bold; 
                    margin:0 0 8px 0; 
                    color:#2d3748; 
                    text-transform:uppercase;
                    line-height:1.1;
                ">
                    ${data.personal.name}
                </h1>
                <div style="font-size:10pt; color:#4a5568; line-height:1.4;">
                    ${contacts.length > 0 ? contacts.join('<br>') : ''}
                </div>
            </div>
        </div>
    `;
}

/* ================= SECTION TITLES ================= */
function generateSectionTitle(title) {
    return `
        <div style="margin-top:15px; margin-bottom:10px;">
            <h2 style="font-size:14pt; font-weight:bold; margin:0; color:#000;">${title}</h2>
            <div style="border-bottom:1px solid #000; width:100%; margin-top:2px;"></div>
        </div>
    `;
}

function generateSectionTitleBig(title) {
    return `
        <div style="margin-top:20px; margin-bottom:12px;">
            <h2 style="font-size:16pt; font-weight:bold; margin:0; color:#000;">${title}</h2>
            <div style="border-bottom:2px solid #000; width:100%; margin-top:4px;"></div>
        </div>
    `;
}

/* ================= WORK & EDUCATION ================= */
function generateWorkSection(title, works) {
    if (!works || works.length === 0) return '';
    let html = generateSectionTitle(title);
    works.forEach(work => {
        if (!work.company && !work.title) return;
        const bulletList = work.desc ? work.desc.split('\n').filter(l => l.trim() !== '') : [];
        html += `
            <div style="margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <strong style="font-size:12pt;">${work.title || ''}</strong>
                    <span style="font-style:italic; font-size:10pt; color:#4a5568;">${work.years || ''}</span>
                </div>
                <div style="font-weight:bold; color:#2d3748; margin-bottom:5px;">${work.company || ''}</div>
                <ul style="margin:0; padding-left:20px; text-align:justify;">
                    ${bulletList.map(item => `<li style="margin-bottom:2px;">${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    return html;
}

function generateEducationSection(title, educations) {
    if (!educations || educations.length === 0) return '';
    let html = generateSectionTitle(title);
    educations.forEach(edu => {
        if (!edu.university) return;
        html += `
            <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <strong>${edu.major || ''}</strong>
                    <span style="font-style:italic; font-size:10pt;">${edu.years || ''}</span>
                </div>
                <div>${edu.university}</div>
            </div>
        `;
    });
    return html;
}

/* ================= INFORMASI TAMBAHAN ================= */
function generateAdditionalInfoSection(t, data) {
    const hasContent = data.languages || data.certifications || data.awards;
    if (!hasContent) return '';

    let html = generateSectionTitleBig(t.additional);

    // Languages
    if (data.languages) {
        const langs = data.languages.split(',').map(s => s.trim()).filter(Boolean);
        html += `
            <div style="margin-bottom:12px;">
                <strong style="color:#2d3748;">Languages:</strong>
                <span style="margin-left:8px;">${langs.join(', ')}</span>
            </div>
        `;
    }
    
    // Certifications
    if (data.certifications) {
        const certs = data.certifications.split(',').map(s => s.trim()).filter(Boolean);
        html += `
            <div style="margin-bottom:12px;">
                <strong style="color:#2d3748;">Certifications:</strong>
                <span style="margin-left:8px;">${certs.join(', ')}</span>
            </div>
        `;
    }
    
    // Awards
    if (data.awards) {
        const awards = data.awards.split(',').map(s => s.trim()).filter(Boolean);
        html += `
            <div style="margin-bottom:12px;">
                <strong style="color:#2d3748;">Awards:</strong>
                <span style="margin-left:8px;">${awards.join(', ')}</span>
            </div>
        `;
    }
    
    return html;
}
