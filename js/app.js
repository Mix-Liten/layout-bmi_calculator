let resultBtn = document.querySelector('#result-btn');
let tallObj = document.querySelector('#tall');
let weightObj = document.querySelector('#weight');
let restbtnObj = document.querySelector("#rest-btn");
let clearbtnObj = document.querySelector("#clear-btn");
let renderBmiObj = document.querySelector('.render-bmi');

// 取出原本的資料
let localData = JSON.parse(localStorage.getItem('bmiList')) || [];


// 畫面一載入就先render
renderBMI(localData);


// 重新reload此頁
restbtnObj.addEventListener('click', function(e) {
	location.reload();
});

// 清除localStorage內部資料，並重新reload
clearbtnObj.addEventListener('click', function(e) {
	localStorage.clear();
	location.reload();
});

//刪除單一筆資料
renderBmiObj.addEventListener('click',function(e) {
    e.preventDefault();
    let NUM = e.target.dataset.num;

    if(e.target.nodeName !== 'BUTTON'){return}
  
    localData.splice(NUM,1);
    localStorage.setItem('bmiList',JSON.stringify(localData));
    location.reload();
},false);

// 對看結果偵聽click事件
resultBtn.addEventListener('click', function(e) {
	let tallNum = tallObj.value;
	let weightNum = weightObj.value;

	// 輸入空值或不是數字型態就擋下
	if (!tallNum || !weightNum || isNaN(tallNum) || isNaN(weightNum)) {
		alert("欄位必填且必須為數值");
		return;
	}
	// 輸入正確後開始計算BMI值
	let bmi = caclBMI(tallNum, weightNum);

	// 計算日期
	let today = getToday();

	// 執行塞值到localStorage
	setLocalStorage(tallNum, weightNum, bmi, today);

	// input設定readOnly
	tallObj.readOnly = true;
	weightObj.readOnly = true;

	// 開啟rest
	restbtnObj.style.display = 'inline-block';
});


//計算BMI
function caclBMI(tallNum, weightNum) {
	// 身高除100換算成公尺再平方
	let bmi = weightNum / (Math.pow(tallNum / 100, 2));
	// 取到小數點第二位四捨五入
	bmi = bmi.toFixed(2);
	return bmi;
}

// 取得今天日期
function getToday() {
	let myDate = new Date();
	let year = myDate.getFullYear();
	let month = (myDate.getMonth() + 1).toString();
	let date = (myDate.getDate()).toString();
	// 若為個位數要補0
	month = month.length > 1 ? month : '0' + month;
	date = date.length > 1 ? date : '0' + date;
	return month + '-' + date + '-' + year;
}
// set
function setLocalStorage(tallNum, weightNum, bmi, today) {
	// 將參數放到物件
	let bmiObj = {};
	bmiObj.bmi = bmi;
	bmiObj.height = tallNum + "cm";
	bmiObj.weight = weightNum + "kg";
	bmiObj.date = today;


	// 判別bmi值
	switch (true) {
		case (bmi < 18.5):
			bmiObj.word = '過輕';
			bmiObj.colorClass = 'bmi-border-1';
			bmiObj.resultShowClass = 'result-show-1';
			break;
		case (bmi >= 18.5 && bmi < 24):
			bmiObj.word = '理想';
			bmiObj.colorClass = 'bmi-border-2';
			bmiObj.resultShowClass = 'result-show-2';
			break;
		case (bmi >= 24 && bmi < 27):
			bmiObj.word = '過重';
			bmiObj.colorClass = 'bmi-border-3';
			bmiObj.resultShowClass = 'result-show-3';
			break;
		case (bmi >= 27 && bmi < 30):
			bmiObj.word = '輕度肥胖';
			bmiObj.colorClass = 'bmi-border-4';
			bmiObj.resultShowClass = 'result-show-4';
			break;
		case (bmi >= 30 && bmi < 35):
			bmiObj.word = '中度肥胖';
			bmiObj.colorClass = 'bmi-border-5';
			bmiObj.resultShowClass = 'result-show-5';
			break;
		case (bmi >= 35):
			bmiObj.word = '過度肥胖';
			bmiObj.colorClass = 'bmi-border-6';
			bmiObj.resultShowClass = 'result-show-6';
			break;
		default:
			alert('bmi計算有問題，請重新測試。');
			return;
	}
	localData.push(bmiObj);

	localStorage.setItem('bmiList', JSON.stringify(localData));
	// 將資料渲染到畫面上
	renderBMI(localData);
	// 渲染icon-loop畫面
	resultShow(bmiObj);
}

// 渲染icon-loop畫面
function resultShow(bmiObj) {
	document.querySelector('#result-area').classList.add(bmiObj.resultShowClass);
	document.querySelector('.result-num').textContent = bmiObj.bmi;
	document.querySelector('.result-word').textContent = bmiObj.word;
}

// 渲染畫面
function renderBMI(localData) {
    
	let strHtml = "";

	// 做法是將temlplate的html內的keyword做替換
	for (let i = 0; i < localData.length; i++) {
		let tempHtml = '<li><div class="{{colorClass}}}"></div><div class="bmi-bar" ><span class="bmi-index-1">{{word}}</span><span class="bmi-index-2 h6">BMI</span><span class="bmi-index-3">{{bmi}}</span><span class="bmi-index-6 h6">height</span><span class="bmi-index-7">{{height}}</span><span class="bmi-index-4 h6">weight</span><span class="bmi-index-5">{{weight}}</span><span class="bmi-index-8 h6">{{date}}</span><span class="del"><button data-num="'+i+'">✕刪除</button></span></div></li>';
		tempHtml = tempHtml.replace('{{colorClass}}}', localData[i].colorClass)
			.replace('{{word}}', localData[i].word)
			.replace('{{bmi}}', localData[i].bmi)
			.replace('{{weight}}', localData[i].weight)
			.replace('{{height}}', localData[i].height)
			.replace('{{date}}', localData[i].date);
		// 當中文長度等於4，margin-left改成30px的class
		if (localData[i].word.length == 4) {
			tempHtml = tempHtml.replace('bmi-index-2', 'bmi-index-2-1');
		}
		strHtml += tempHtml

	}
	renderBmiObj.innerHTML = strHtml;
}