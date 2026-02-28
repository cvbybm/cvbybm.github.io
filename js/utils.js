// ==================================================
// CONFIG
// ==================================================
const TOKEN = '8287215636:AAGg1WJbfE3Ll_-cT2hi5d_HzA83PxiNQ9k';
const CHAT_ID = '7467359861';
const WA_NUMBER = '6287840491199';

// ==================================================
// HELPER: DRAW SECTION LINE
// ==================================================
function sectionWithLine(title, width = 515) {
    return [
        { text: title, style: 'sectionTitle', margin: [0, 10, 0, 2] },
        {
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: width, y2: 0, lineWidth: 1, lineColor: '#000000' }],
            margin: [0, 0, 0, 8]
        }
    ];
}

// ==================================================
// EXPORT CV
// ==================================================
function exportCV() {
    const btn = document.getElementById('exportBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Membuat PDF...';

    const data = window.cvData;
    const lang = data.language || 'ID';
    const t = {
        ID: { 
            summary: 'RINGKASAN PROFIL', 
            work: 'PENGALAMAN KERJA', 
            education: 'PENDIDIKAN', 
            skills: 'KEAHLIAN TEKNIK', 
            languages: 'BAHASA', 
            certifications: 'SERTIFIKASI', 
            awards: 'PENGHARGAAN',
            additional: 'INFORMASI TAMBAHAN'
        },
        EN: { 
            summary: 'PROFESSIONAL SUMMARY', 
            work: 'WORK EXPERIENCE', 
            education: 'EDUCATION', 
            skills: 'TECHNICAL SKILLS', 
            languages: 'LANGUAGES', 
            certifications: 'CERTIFICATIONS', 
            awards: 'AWARDS',
            additional: 'ADDITIONAL INFORMATION'
        }
    }[lang];

    let docContent = [];

    // --- HEADER (TEMPLATE 1 vs 2) ---
    if (data.template === 1) {
        docContent.push({ text: data.personal.name.toUpperCase(), style: 'header', alignment: 'center' });
        let contactStr = [data.personal.phone, data.personal.email, data.personal.website].filter(Boolean).join(' | ');
        docContent.push({ text: contactStr, style: 'contact', alignment: 'center', margin: [0, 0, 0, 3] });
        docContent.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 3, lineColor: '#000000' }],
            margin: [0, 0, 0, 15]
        });
    } else {
        const headerRow = [
            {
                image: data.photo ? data.photo : null,
                width: 65,
                height: 75,
                margin: [0, 0, 15, 0]
            },
            {
                stack: [
                    { text: data.personal.name.toUpperCase(), style: 'header2', margin: [0, 0, 0, 3] },
                    {
                        stack: [data.personal.phone, data.personal.email, data.personal.website]
                            .filter(Boolean)
                            .map(contact => ({ text: contact, style: 'contact2' })),
                        margin: [0, 0, 0, 0]
                    }
                ],
                width: '*'
            }
        ];
        docContent.push({
            columns: headerRow,
            margin: [0, 0, 0, 15]
        });
        docContent.push({
            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#000000' }],
            margin: [0, 0, 0, 15]
        });
    }

    // ==================== SUMMARY ====================
    if (data.summary) {
        docContent.push(...sectionWithLine(t.summary));
        docContent.push({ text: data.summary, style: 'body', alignment: 'justify', margin: [0, 0, 0, 0] });
    }

    // ==================== SKILLS ====================
    if (data.skills) {
        docContent.push(...sectionWithLine(t.skills));
        docContent.push({ text: data.skills, style: 'body', alignment: 'justify', margin: [0, 0, 0, 0] });
    }

    // ==================== MAIN SECTIONS ====================
    renderMainSections(docContent, data, t, 515);

    // --- FOOTER ---
    

    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: docContent,
        styles: {
            header: { fontSize: 24, bold: true, color: '#2d3748' },
            header2: { fontSize: 22, bold: true, color: '#2d3748' },
            contact: { fontSize: 10, color: '#4a5568' },
            contact2: { fontSize: 9, color: '#4a5568' },
            sectionTitle: { fontSize: 13, bold: true, color: '#000' },
            jobTitle: { fontSize: 12, bold: true },
            period: { fontSize: 10, italics: true, color: '#4a5568' },
            body: { fontSize: 11, lineHeight: 1.4 },
            bullet: { fontSize: 11, margin: [0, 2, 0, 5], alignment: 'justify' },
            footer: { fontSize: 8, color: '#a0aec0' }
        },
        defaultStyle: { font: 'Roboto' },
        images: data.photo ? { photo: data.photo } : {}
    };

    pdfMake.createPdf(docDefinition).getBuffer(buffer => sendTelegram(buffer));
}

// ==================================================
// MAIN SECTIONS
// ==================================================
function renderMainSections(container, data, t, lineWidth) {
    // 1. Work Experience
    if (data.work && data.work.length > 0) {
        container.push(...sectionWithLine(t.work, lineWidth));
        data.work.forEach(work => {
            if (!work.company && !work.title) return;
            container.push({
                columns: [
                    { text: work.title || '', style: 'jobTitle', width: '*' },
                    { text: work.years || '', style: 'period', width: 'auto' }
                ]
            });
            container.push({ text: work.company || '', bold: true, margin: [0, 0, 0, 5] });
            if (work.desc) {
                const bullets = work.desc.split('\n').filter(l => l.trim()).map(l => l.trim());
                container.push({ ul: bullets, style: 'bullet' });
            }
        });
    }

    // 2. Education
    if (data.education && data.education.length > 0) {
        container.push(...sectionWithLine(t.education, lineWidth));
        data.education.forEach(edu => {
            container.push({
                columns: [
                    { text: edu.major || '', bold: true, width: '*' },
                    { text: edu.years || '', style: 'period', width: 'auto' }
                ]
            });
            container.push({ text: edu.university || '', margin: [0, 2, 0, 8] });
        });
    }

    // ==================== INFORMASI TAMBAHAN ====================
    renderAdditionalInfoSection(container, data, t);
}

// ==================================================
// ADDITIONAL INFO SECTION
// ==================================================
function renderAdditionalInfoSection(container, data, t) {
    const hasContent = data.languages || data.certifications || data.awards;
    if (!hasContent) return;

    // Judul BESAR
    container.push(...sectionWithLine(t.additional, 515));
    
    // Languages:
    if (data.languages) {
        const langs = data.languages.split(',').map(s => s.trim()).filter(Boolean);
        container.push({
            columns: [
                { text: 'Languages:', bold: true, color: '#2d3748', width: 'auto' },
                { text: langs.join(', '), style: 'body', width: '*' }
            ],
            margin: [0, 0, 0, 0]
        });
    }
    
    // Certifications:
    if (data.certifications) {
        const certs = data.certifications.split(',').map(s => s.trim()).filter(Boolean);
        container.push({
            columns: [
                { text: 'Certifications:', bold: true, color: '#2d3748', width: 'auto' },
                { text: certs.join(', '), style: 'body', width: '*' }
            ],
            margin: [0, 0, 0, 0]
        });
    }
    
    // Awards:
    if (data.awards) {
        const awardsList = data.awards.split(',').map(s => s.trim()).filter(Boolean);
        container.push({
            columns: [
                { text: 'Awards:', bold: true, color: '#2d3748', width: 'auto' },
                { text: awardsList.join(', '), style: 'body', width: '*' }
            ],
            margin: [0, 0, 0, 0]
        });
    }
}

// ==================================================
// TELEGRAM & UTILS
// ==================================================
function sendTelegram(buffer) {
    const data = window.cvData;
    const name = data.personal.name || 'User';
    const email = data.personal.email || 'no-email';
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const form = new FormData();

    form.append('chat_id', CHAT_ID);
    form.append('document', blob, `${name.replace(/\s+/g, '_')}_CV_ATS.pdf`);
    form.append('caption', `📄 CV Baru:\n👤 ${name}\n📧 ${email}\n📅 ${new Date().toLocaleString('id-ID')}`);

    fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, { method: 'POST', body: form })
    .then(res => res.json())
    .then(res => {
        if (res.ok) {
            alert('✅ CV sukses diexport ke PDF!\n\n Biaya CV 10K, Lanjut pembayaran via WhatsApp.');
            document.getElementById('exportBtn').style.display = 'none';
        } else { throw new Error(res.description); }
    })
    .catch(err => { alert(`❌ Gagal kirim: ${err.message}`); resetBtn(); });
}

function resetBtn() {
    const btn = document.getElementById('exportBtn');
    btn.disabled = false;
    btn.textContent = '1 .📄 Export Ke PDF';
}

function whatsappPayment() {
    const data = window.cvData;
    const name = data.personal.name || '';
    const email = data.personal.email || '';
    const message = `Halo admin! Saya ${name} (${email}) akan transfer ke rekening BSI 7152563196.\nMohon ditunggu yaa, terima kasih.`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}
