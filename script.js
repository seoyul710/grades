let showsNow = 1
function newCol(number) {
  return `<div class="input-col">
  <div class="sebject">
    <label for="subject-${number}" class="large deepgray">#${number}</label>
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

  <div class="final large">
  <label for="final-score-${number}">기말고사 점수:</label>
  <input type="number" name="final" min="0" max="100" id="final-score-${number}"><span class="final-max-score">/100</span><span> 점</span>
  </div>
</div>`
} 

function showmore() {
  showsNow ++;
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
function calculate() {
  const cols = document.querySelectorAll('.input-col');
  const inputs = [];

  for (const col of cols) {
    const subject_name = col.querySelector('select[name="subject"]').value;
    const performance_score = Number(col.querySelector('input[name="performance"]').value);
    const final_score = Number(col.querySelector('input[name="final"]').value);

    if (!subject_name) {
      alert("과목을 선택해 주세요");
      return false;
    }

    let isValid = false;

    if (subject_name === '수학' || subject_name === '영어') {
      isValid = performance_score > 0 && performance_score <= 50 && final_score > 0 && final_score <= 100;
    } else if (subject_name === '사회') {
      isValid = performance_score > 0 && performance_score <= 30 && final_score > 0 && final_score <= 100;
    } else if (subject_name === '정보') {
      isValid = performance_score > 0 && performance_score <= 20 && final_score > 0 && final_score <= 100;
    } else {
      isValid = performance_score > 0 && performance_score <= 40 && final_score > 0 && final_score <= 100;
    }

    if (isValid) {
      inputs.push({
        subject_name: subject_name,
        performance_score: performance_score,
        final_score: final_score
      });
    } else {
      alert("올바른 값을 입력해 주세요");
      return false;
    }
  }
  
  inputs.forEach(subject => {
    const subject_name = subject['subject_name'];
    const performance_score = subject['performance_score'];
    const final_score = subject['final_score'];

    let total_score
    let converted

    if (subject_name === '수학' || subject_name === '영어') {
      converted = final_score / 2
      total_score = performance_score + converted;
    } else if (subject_name === '사회') {
      converted = final_score * 0.7
      total_score = performance_score + converted;
    } else if (subject_name === '정보') { 
      converted = final_score * 0.8
      total_score = performance_score + converted;
    } else {
      converted = final_score * 0.6
      total_score = performance_score + converted;
    }

    const total_score_rounded = Math.round(total_score * 100) / 100;
    const converted_rounded = Math.round(converted * 100) / 100;

    result.push({
    subject_name: subject_name,
    total_score: total_score_rounded,
    grade: grade(Math.round(total_score)),
    formula: `${performance_score} + ${converted_rounded} = ${total_score_rounded}`
    });
  });
  return true;
}


function grade(score) {
  if (score >= 90) {
    return 'A';
  } else if (score >= 80) {
    return 'B';
  } else if (score >= 70) {
    return 'C';
  } else if (score >= 60) {
    return 'D';
  } else if (score < 60) {
    return 'E';
  }
}

function displayResult() {
  result = [];
  const calculationSuccess = calculate()
  if (!calculationSuccess) {
    console.log(calculationSuccess)
    return;
  }
  result.forEach((subject, i) => {
    const char = i === 0 ? `<div class="results-container">
      <div class="result-col">
        <span class="xxlarge">#1 ${subject['subject_name']}</span>
          <div class="result-detail-container xlarge">
            <div class="name-score-container"><span class="result-title">원점수<div class="icon-wrapper"><i class="fa-regular fa-circle-question"></i><div class="tooltip">원점수란 합계점수를 반올림해<br> 성취도에 반영되는 점수입니다.</div></div></span><span class="xxlarge brown">${Math.round(subject['total_score'])}</span></div>
            <div class="name-score-container"><span class="result-title">합계점수<div class="icon-wrapper"><i class="fa-regular fa-circle-question"></i><div class="tooltip">합계점수란 시험 점수를 환산해<br>수행평가 점수와 더한 점수입니다.<br><span class="brown">현재 계산식: ${subject['formula']}</span></div></div></span><span class="xxlarge brown">${subject['total_score']}</span></div>
            <div class="name-score-container"><span>성취도</span><span class="xxlarge brown">${subject['grade']}</span></div>
        </div>
      </div>
    </div>`:`<div class="results-container">
      <div class="result-col">
        <span class="xxlarge">#${i + 1} ${subject['subject_name']}</span>
          <div class="result-detail-container xlarge">
            <div class="name-score-container"><span>원점수</span><span class="xxlarge brown">${Math.round(subject['total_score'])}</span></div>
            <div class="name-score-container"><span class="result-title">합계점수<div class="icon-wrapper"><i class="fa-regular fa-circle-question"></i><div class="tooltip"><span class="brown">현재 계산식: ${subject['formula']}</span></div></div></span><span class="xxlarge brown">${subject['total_score']}</span></div>
            <div class="name-score-container"><span>성취도</span><span class="xxlarge brown">${subject['grade']}</span></div>
        </div>
      </div>
    </div>`
    
    document.querySelector('.main-container').insertAdjacentHTML('beforeend', char)

    document.querySelectorAll('.icon-wrapper i').forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.toggle('active');
        console.log(icon.classList);
      });
    });
  });
  document.getElementById('calculate').style.display = 'none';
  document.getElementById('more-btn').style.display = 'none';
  disableSelectAndInput()
}


document.getElementById('calculate').addEventListener('click', displayResult)