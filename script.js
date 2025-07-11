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
      <option value="중국어">중국어</option>
    </select>
  </div>

  <div class="performance large">
  <label for="performance-score-${number}">수행평가 점수:</label>
  <input type="number" name="performance" min="0" max="70" id="performance-score-${number}"><span>점</span>
  </div>

  <div class="midterm large">
  <label for="midterm-score-${number}">중간고사 점수:</label>
  <input type="number" name="midterm" min="0" max="100" id="midterm-score-${number}"><span>점</span>
  </div>

  <div class="final large">
  <label for="final-score-${number}">기말고사 점수:</label>
  <input type="number" name="final" min="0" max="100" id="final-score-${number}"><span>점</span>
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


function addHideMidtermEventlLstner(number) {
  document.getElementById(`subject-${number}`).addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    const changedSelect = document.getElementById(`midterm-score-${number}`);
    
    if (selectedValue == '수학' || selectedValue == '영어') {
      changedSelect.closest('.midterm').classList.remove('hidden')
    } else {
      changedSelect.closest('.midterm').classList.add('hidden')
    }
  });
}

function resetAll() {
  result = [];
  resetCol();
  addHideMidtermEventlLstner(1);
  document.getElementById('calculate').style.display = 'block';
  document.getElementById('more-btn').style.display = 'block';
}

addHideMidtermEventlLstner(1)
document.getElementById('more-btn').addEventListener('click', () => {
  showmore()
  addHideMidtermEventlLstner(showsNow)
});

document.getElementById('reload-btn').addEventListener('click', resetAll);





let result = [];
function calculate() {
  const cols = document.querySelectorAll('.input-col');
  const inputs = [];

  for (const col of cols) {
    const subject_name = col.querySelector('select[name="subject"]').value;
    const performance_score = Number(col.querySelector('input[name="performance"]').value);
    const midterm_score = Number(col.querySelector('input[name="midterm"]').value);
    const final_score = Number(col.querySelector('input[name="final"]').value);

    if (!subject_name) {
      alert("과목을 선택해 주세요");
      return false;
    }

    let isValid = false;

    if (subject_name === '수학') {
      isValid = performance_score > 0 && performance_score <= 50 && midterm_score > 0 && midterm_score <= 100 && final_score > 0 && final_score <= 97;
    } else if (subject_name === '영어') {
      isValid = performance_score > 0 && performance_score <= 50 && final_score > 0 && final_score <= 100;
    } else if (subject_name === '중국어') {
      isValid = performance_score > 0 && performance_score <= 70 && final_score > 0 && final_score <= 100;
    } else {
      isValid = performance_score > 0 && performance_score <= 40 && final_score > 0 && final_score <= 100;
    }

    if (isValid) {
      inputs.push({
        subject_name: subject_name,
        performance_score: performance_score,
        midterm_score: midterm_score,
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
    const midterm_score = subject['midterm_score'];
    const final_score = subject['final_score'];

    let total_score

    if (subject_name === '수학') {
      total_score = performance_score + midterm_score / 4 + final_score / 97 * 25;
    } else if (subject_name === '영어') {
      total_score = performance_score + midterm_score / 4 + final_score / 4;
    } else if (subject_name === '중국어') {
      total_score = performance_score + final_score * 0.3;
    } else {
      total_score = performance_score + final_score * 0.6;
    }

    const total_score_rounded = Math.round(total_score * 100) / 100;

    result.push({
    subject_name: subject_name,
    total_score: total_score_rounded,
    grade: grade(Math.round(total_score))
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
    const char = `<div class="results-container">
      <div class="result-col">
        <span class="xxlarge">#${i + 1} ${subject['subject_name']}</span>
          <div class="result-detail-container xlarge">
            <div class="name-score-container"><span>원점수</span><span class="xxlarge brown">${Math.round(subject['total_score'])}</span></div>
            <div class="name-score-container"><span>합계점수</span><span class="xxlarge brown">${subject['total_score']}</span></div>
            <div class="name-score-container"><span>성취도</span><span class="xxlarge brown">${subject['grade']}</span></div>
        </div>
      </div>
    </div>`
    document.querySelector('.main-container').insertAdjacentHTML('beforeend', char)
  });
  document.getElementById('calculate').style.display = 'none';
  document.getElementById('more-btn').style.display = 'none';
  disableSelectAndInput()
}


document.getElementById('calculate').addEventListener('click', displayResult)