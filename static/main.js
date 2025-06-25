// Plataforma de Cursos - JavaScript principal

let cursos = [];

async function carregarCursos() {
    const res = await fetch('/api/cursos');
    const arquivos = await res.json();
    let cursosTemp = [];
    for (const arquivo of arquivos) {
        try {
            const resp = await fetch(`/cursos/${arquivo}`);
            const data = await resp.json();
            if (Array.isArray(data)) {
                cursosTemp.push(...data);
            } else if (typeof data === 'object' && data !== null) {
                cursosTemp.push(data);
            }
        } catch (e) {
            console.error('Erro ao carregar', arquivo, e);
        }
    }
    cursos = cursosTemp;
    console.log('Cursos carregados:', cursos);
    renderListaCursos();
}

function renderListaCursos() {
    let html = '<div class="row">';
    cursos.forEach((curso, idx) => {
        const imgSrc = curso.imagem || `https://source.unsplash.com/600x200/?education,course,${encodeURIComponent(curso.titulo)}`;
        html += `
        <div class="col-12 col-md-6 mb-4">
            <div class="card course-card h-100" onclick="abrirTopicos(${idx})">
                <img src='${imgSrc}' class='course-img' alt='Imagem do curso'>
                <div class="card-body d-flex flex-column justify-content-center align-items-start">
                    <h5 class="card-title mb-2">${curso.titulo}</h5>
                    <p class="card-text mb-0">${curso.descricao}</p>
                </div>
            </div>
        </div>`;
    });
    html += '</div>';
    document.getElementById('main-content').innerHTML = html;
    document.getElementById('nav-title').innerText = 'Plataforma de Cursos';
}

function abrirTopicos(idx) {
    const curso = cursos[idx];
    let html = `<button class='btn btn-outline-primary mb-3 px-4 py-2 fw-bold' style='border-radius:2rem;' onclick='renderListaCursos()'><i class="bi bi-arrow-left"></i> Voltar</button>`;
    html += `<h3 class='mb-4'><i class='bi bi-journal-code'></i> ${curso.titulo}</h3>`;
    if (!curso.topicos || !curso.topicos.length) {
        html += `<div class='alert alert-warning'>Nenhum tópico disponível para este curso.</div>`;
    } else {
        html += `<ul class='list-group mb-4'>`;
        curso.topicos.forEach((topico, topicoIdx) => {
            html += `<li class='list-group-item list-group-item-action d-flex align-items-center' style='cursor:pointer' onclick='abrirAulas(${idx},${topicoIdx})'><span class='me-2 badge bg-primary'>${topicoIdx+1}</span> ${topico.titulo}</li>`;
        });
        html += `</ul>`;
    }
    document.getElementById('main-content').innerHTML = html;
    document.getElementById('nav-title').innerText = curso.titulo;
}

function isAulaSuportada(aula) {
    if (!aula || !aula.video) return false;
    const url = aula.video;
    return (
        url.includes('youtube.com') || url.includes('youtu.be') ||
        url.endsWith('.mp4') || url.endsWith('.mp3') ||
        url.includes('/video/') || url.includes('/audio/')
    );
}

function abrirAulas(cursoIdx, topicoIdx, aulaIdx) {
    const curso = cursos[cursoIdx];
    const topico = curso.topicos[topicoIdx];
    const aulas = topico.aulas || [];
    const aulasSuportadas = aulas.filter(isAulaSuportada);
    if (!aulasSuportadas.length) {
        document.getElementById('main-content').innerHTML = `<div class='alert alert-warning'>Nenhum vídeo ou áudio suportado neste tópico.</div>`;
        return;
    }
    let idxSelecionada = typeof aulaIdx === 'number' ? aulaIdx : 0;
    if (idxSelecionada < 0 || idxSelecionada >= aulasSuportadas.length) idxSelecionada = 0;
    const aula = aulasSuportadas[idxSelecionada];
    let html = `<button class='btn btn-outline-primary mb-3 px-4 py-2 fw-bold' style='border-radius:2rem;' onclick='abrirTopicos(${cursoIdx})'><i class="bi bi-arrow-left"></i> Voltar para tópicos</button>`;
    html += `<div class='row'>`;
    html += `<div class='col-12 col-lg-8 mb-3'>`;
    html += `<div class='card mb-4 shadow-sm' style='background:#232946;'>
        <div class='ratio ratio-16x9'>
            <div id='video-player'>${getVideoEmbed(aula.video)}</div>
        </div>
        <div class='card-body'>
            <h5 class='card-title'>${aula.titulo}</h5>
            <p class='card-text'>${aula.descricao || ''}</p>
        </div>
    </div>`;
    html += `</div>`;
    html += `<div class='col-12 col-lg-4'>`;
    html += `<div class='card h-100 shadow-sm' style='background:#232946;'><div class='card-header bg-primary text-white'><b>Aulas do Tópico</b></div><ul class='list-group list-group-flush'>`;
    aulasSuportadas.forEach((a, i) => {
        html += `<li class='list-group-item list-group-item-action ${i === idxSelecionada ? 'active' : ''}' style='cursor:pointer' onclick='abrirAulas(${cursoIdx},${topicoIdx},${i})'>${a.titulo}</li>`;
    });
    html += `</ul></div></div></div>`;
    document.getElementById('main-content').innerHTML = html;
    document.getElementById('nav-title').innerText = `${curso.titulo} - ${topico.titulo}`;
}

function getVideoEmbed(url) {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = url.split('v=')[1] || url.split('/').pop();
        if (videoId.includes('&')) videoId = videoId.split('&')[0];
        return `<div id="video-container"><iframe id="video-player" class="w-100" style="min-height:180px; width:100%; height:100%;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe></div>`;
    }
    if (url.endsWith('.mp4') || url.includes('/video/')) {
        return `<div id="video-container">
            <video id="video-player" class="w-100" style="min-height:180px; width:100%; height:100%; background:#000;" controls onerror="this.parentNode.innerHTML='<div class=\'alert alert-danger\'>Vídeo não pôde ser carregado.<br><a href=\'${url}\' target=\'_blank\' class=\'btn btn-primary mt-2\'>Abrir vídeo em nova aba</a></div>'"><source src="${url}" type="video/mp4">Seu navegador não suporta vídeo.</video>
            <div class="mt-2"><a href="${url}" target="_blank" class="btn btn-outline-primary btn-sm">Abrir vídeo em nova aba</a></div>
        </div>`;
    }
    if (url.endsWith('.mp3') || url.includes('/audio/')) {
        return `<div id="video-container">
            <audio id="video-player" class="w-100" controls style="width:100%"><source src="${url}" type="audio/mp3">Seu navegador não suporta áudio.</audio>
            <div class="mt-2"><a href="${url}" target="_blank" class="btn btn-outline-primary btn-sm">Abrir áudio em nova aba</a></div>
        </div>`;
    }
    return `<div id="video-container"><a href="${url}" target="_blank" class="btn btn-outline-primary">Abrir conteúdo</a></div>`;
}

// Inicializa com a lista de cursos dinâmica
carregarCursos();
