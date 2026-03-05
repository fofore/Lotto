const fortunes = [
    { title: "🌟 [매우 좋음] 대박의 기운이 감돕니다!", desc: "오늘은 상위 당첨의 기운이 매우 강합니다. 1, 2등을 노려볼 만한 완벽한 타이밍입니다. 행운의 숫자들이 당신을 향해 정렬하고 있네요!" },
    { title: "✨ [좋음] 흐름이 긍정적입니다.", desc: "좋은 재물운이 들어와 있습니다. 3등 이상의 상위권 당첨 확률이 평소보다 높습니다. 기분 좋은 마음으로 도전해 보세요." },
    { title: "🍀 [보통] 안정적인 하루입니다.", desc: "무난한 운세입니다. 4등, 5등의 소소한 당첨으로 일상의 작은 기쁨을 누리기에 적합한 날입니다. 가볍게 즐겨보세요." },
    { title: "🌙 [주의] 오늘은 신중하세요.", desc: "재물운이 잠시 쉬어가는 날입니다. 큰 기대보다는 복권 구입 행위 자체의 즐거움만 느끼시는 것을 권장합니다." }
];

let currentSeed = 0;

// 1. 문자열을 고유한 해시 숫자(Seed)로 변환하는 함수
function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32비트 정수로 변환
    }
    return Math.abs(hash);
}

// 2. 시드(Seed) 기반 난수 생성기 (일반 Math.random 대체)
function seededRandom() {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
}

// 공 색상 반환 함수
function getLottoColorClass(num) {
    if (num <= 10) return 'color-1';
    if (num <= 20) return 'color-2';
    if (num <= 30) return 'color-3';
    if (num <= 40) return 'color-4';
    return 'color-5';
}

// 로또 번호 6개 생성 (시드 기반)
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
    const gender = document.getElementById('gender').value;

    if (!birthdate) {
        alert("생년월일을 입력해주세요!");
        return;
    }

    document.getElementById('input-section').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        showResults(birthdate, gender);
    }, 1500);
}

function showResults(birthdate, gender) {
    document.getElementById('result').style.display = 'block';

    // 핵심: 오늘 날짜 + 생년월일 + 성별을 합쳐서 고유 문자열 생성
    const today = new Date();
    const dateString = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const uniqueString = birthdate + gender + dateString;

    // 문자열을 해시 변환하여 시드값으로 설정
    currentSeed = generateHash(uniqueString);

    // 고정된 시드를 바탕으로 운세 선택
    const fortuneIndex = Math.floor(seededRandom() * fortunes.length);
    const selectedFortune = fortunes[fortuneIndex];
    
    document.getElementById('fortune-title').innerText = selectedFortune.title;
    document.getElementById('fortune-desc').innerText = selectedFortune.desc;

    // 로또 번호 5세트 생성 및 렌더링
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

function resetApp() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('input-section').style.display = 'block';
}
