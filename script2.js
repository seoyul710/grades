let showsNow = 1

function newCol(number) {
  return `<div class="input-col">
  <div class="sebject">
    <label for="subject-1" class="large deepgray">#${number}</label>
    <select name="subject" id="subject-${number}" class="large white">
      <option value="" disabled selected hidden>과목</option>
      <option value="국어">국어</option>
      <option value="사회">사회</option>
      <option value="역사">역사</option>
      <option value="수학">수학</option>
      <option value="과학">과학</option>
      <option value="영어">영어</option>
      <option value="정보">정보</option>
    </select>
  </div>

  <div class="performance large">
  <label for="performance-score-${number}">수행평가 점수:</label>
  <input type="number" name="performance" min="0" max="60" id="performance-score-${number}" class="performance-input"><span class="performance-max-score">/50</span><span> 점</span>
  </div>
</div>`
} 

function showmore() {
  showsNow++;
  document.querySelector('.main-container').insertAdjacentHTML("beforeend", newCol(showsNow));

  if (showsNow == 7) {
    document.getElementById('more-btn').style.display = 'none';
  }
}

function resetCol() {
  showsNow = 1;
  document.querySelector('.main-container').innerHTML = newCol(1);
}

function disableSelectAndInput() {
  document.querySelectorAll('select, input').forEach(el => {
    el.disabled = true;
  });
}

document.querySelectorAll('.icon-wrapper i').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.classList.toggle('active');
  });
});

function addAdjustPerformanceMaxScoreEventListener(number) {
  document.getElementById(`subject-${number}`).addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    const parentDiv = document.getElementById(`performance-score-${number}`).closest('div');
    const firstSpan = parentDiv.querySelector('span');
    firstSpan.textContent = (selectedValue === '수학' || selectedValue === '영어') ? '/50' : selectedValue === '사회' ? '/30' : selectedValue === '정보' ? '/20' : '/40';
  })
}

function resetAll() {
  result = [];
  resetCol();
  addAdjustPerformanceMaxScoreEventListener(1)
  document.getElementById('calculate').style.display = 'block';
  document.getElementById('more-btn').style.display = 'block';
}

addAdjustPerformanceMaxScoreEventListener(1)
document.getElementById('more-btn').addEventListener('click', () => {
  showmore()
  addAdjustPerformanceMaxScoreEventListener(showsNow)
});

document.getElementById('reload-btn').addEventListener('click', resetAll);

let result = [];

function calculateRequiredScores() {
  const cols = document.querySelectorAll('.input-col');
  const inputs = [];

  for (const col of cols) {
    const subject_name = col.querySelector('select[name="subject"]').value;
    const performance_score = Number(col.querySelector('input[name="performance"]').value);

    if (!subject_name) {
      alert("과목을 선택해 주세요");
      return false;
    }

    let maxPerformance;
    if (subject_name === '수학' || subject_name === '영어') {
      maxPerformance = 50;
    } else if (subject_name === '사회') {
      maxPerformance = 30;
    } else if (subject_name === '정보') {
      maxPerformance = 20;
    } else {
      maxPerformance = 40;
    }

    if (performance_score <= 0 || performance_score > maxPerformance) {
      alert("올바른 수행평가 점수를 입력해 주세요");
      return false;
    }

    inputs.push({
      subject_name: subject_name,
      performance_score: performance_score
    });
  }
  
  inputs.forEach(subject => {
    const subject_name = subject.subject_name;
    const performance_score = subject.performance_score;

    let conversionRate;
    if (subject_name === '수학' || subject_name === '영어') {
      conversionRate = 0.5;
    } else if (subject_name === '사회') {
      conversionRate = 0.7;
    } else if (subject_name === '정보') {
      conversionRate = 0.8;
    } else {
      conversionRate = 0.6;
    }

    const grades = {
      'A': 90,
      'B': 80,
      'C': 70,
      'D': 60
    };

    const requiredScores = {};
    
    for (const [grade, minScore] of Object.entries(grades)) {
      
      const requiredFinal = (minScore - performance_score) / conversionRate;
      const requiredFinalRounded = Math.round(requiredFinal * 100) / 100;
      
      if (requiredFinalRounded <= 100 && requiredFinalRounded >= 0) {
        requiredScores[grade] = Math.ceil(requiredFinalRounded);
      } else if (requiredFinalRounded < 0) {
        requiredScores[grade] = 0;
      } else {
        requiredScores[grade] = null;
      }
    }

    result.push({
      subject_name: subject_name,
      performance_score: performance_score,
      requiredScores: requiredScores,
      conversionRate: conversionRate
    });
  });
  
  return true;
}

function displayResult() {
  result = [];
  const calculationSuccess = calculateRequiredScores();
  if (!calculationSuccess) {
    return;
  }
  
  result.forEach((subject, i) => {
    const scores = subject.requiredScores;
    
    let scoresHtml = '';
    for (const [grade, score] of Object.entries(scores)) {
      if (score === null) {
        scoresHtml += `<div class="grade-row"><span class="grade-label brown">${grade}: </span><span class="grade-score impossible">불가능</span></div>`;
      } else if (score === 0) {
        scoresHtml += `<div class="grade-row"><span class="grade-label brown">${grade}: </span><span class="grade-score already">이미 달성</span></div>`;
      } else {
        scoresHtml += `<div class="grade-row"><span class="grade-label brown">${grade}: </span><span class="grade-score">${score}점 이상</span></div>`;
      }
    }

    const char = i === 0 ? `<div class="results-container">
      <div class="result-col">
        <span class="xxlarge">#1 ${subject.subject_name}</span>
        <div class="result-detail-container xlarge">
          <div class="required-scores-container">
            ${scoresHtml}
          </div>
        </div>
      </div>
    </div>` : `<div class="results-container">
      <div class="result-col">
        <span class="xxlarge">#${i + 1} ${subject.subject_name}</span>
        <div class="result-detail-container xlarge">
          <div class="required-scores-container">
            ${scoresHtml}
          </div>
        </div>
      </div>
    </div>`;
    
    document.querySelector('.main-container').insertAdjacentHTML('beforeend', char);
  });
  
  document.getElementById('calculate').style.display = 'none';
  document.getElementById('more-btn').style.display = 'none';
  disableSelectAndInput();
}

document.getElementById('calculate').addEventListener('click', displayResult);