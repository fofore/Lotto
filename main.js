const fortunes = [
    { title: "🌟 [매우 좋음] 대박의 기운이 감돕니다!", desc: "오늘은 상위 당첨의 기운이 매우 강합니다. 1, 2등을 노려볼 만한 완벽한 타이밍입니다. 행운의 숫자들이 당신을 향해 정렬하고 있네요!" },
    { title: "✨ [좋음] 흐름이 긍정적입니다.", desc: "좋은 재물운이 들어와 있습니다. 3등 이상의 상위권 당첨 확률이 평소보다 높습니다. 기분 좋은 마음으로 도전해 보세요." },
    { title: "🍀 [보통] 안정적인 하루입니다.", desc: "무난한 운세입니다. 4등, 5등의 소소한 당첨으로 일상의 작은 기쁨을 누리기에 적합한 날입니다. 가볍게 즐겨보세요." },
    { title: "🌙 [주의] 오늘은 신중하세요.", desc: "재물운이 잠시 쉬어가는 날입니다. 큰 기대보다는 복권 구입 행위 자체의 즐거움만 느끼시는 것을 권장합니다." }
];

let currentSeed = 0;

function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom() {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
}

function getLottoColorClass(num) {
    if (num <= 10) return 'color-1';
    if (num <= 20) return 'color-2';
    if (num <= 30) return 'color-3';
    if (num <= 40) return 'color-4';
    return 'color-5';
}

function generateLottoNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
        const num = Math.floor(seededRandom() * 45) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b);
}

function startAnalysis() {
    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;
    const gender = document.getElementById('gender').value;

    if (!birthdate) {
        alert("생년월일을 입력해주세요!");
        return;
    }

    document.getElementById('input-section').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        showResults(birthdate, birthtime, gender);
    }, 1500);
}

function showResults(birthdate, birthtime, gender) {
    document.getElementById('result-wrapper').style.display = 'block';

    const today = new Date();
    const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // 태어난 시간(birthtime) 변수도 조합에 추가하여 시드값을 더욱 세밀하게 조정
    const uniqueString = birthdate + birthtime + gender + dateString;

    currentSeed = generateHash(uniqueString);

    const fortuneIndex = Math.floor(seededRandom() * fortunes.length);
    const selectedFortune = fortunes[fortuneIndex];
    
    document.getElementById('fortune-title').innerText = selectedFortune.title;
    document.getElementById('fortune-desc').innerText = selectedFortune.desc;

    const lottoContainer = document.getElementById('lotto-results');
    lottoContainer.innerHTML = ''; 

    const setNames = ['A', 'B', 'C', 'D', 'E'];

    for (let i = 0; i < 5; i++) {
        const nums = generateLottoNumbers();
        let ballsHtml = '';
        
        nums.forEach(num => {
            ballsHtml += `<div class="ball ${getLottoColorClass(num)}">${num}</div>`;
        });

        const rowHtml = `
            <div class="lotto-row">
                <div class="set-label">${setNames[i]} 세트</div>
                <div class="balls">
                    ${ballsHtml}
                </div>
            </div>
        `;
        lottoContainer.innerHTML += rowHtml;
    }
}

function saveAsImage() {
    // 이미지 캡처 시 워터마크 표시
    document.getElementById('watermark').style.display = 'block';
    
    const captureDiv = document.getElementById('capture-area');
    
    html2canvas(captureDiv, {
        backgroundColor: '#1e1e1e', // 캡처 시 배경색 지정 (다크모드 유지)
        scale: 2 // 고화질 캡처를 위해 해상도 2배 증가
    }).then(canvas => {
        // 워터마크 다시 숨김
        document.getElementById('watermark').style.display = 'none';

        // 이미지 파일로 변환하여 다운로드 트리거
        const link = document.createElement('a');
        link.download = '오늘의_로또_운세.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function resetApp() {
    document.getElementById('result-wrapper').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
}
