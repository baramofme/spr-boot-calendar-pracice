// ------------------ 현재 날짜 ------------------
let current_year;		// 현재 년도
let current_month;		// 현재 월
let current_date;		// 현재 일
let current_day;		// 현재 요일

document.addEventListener("DOMContentLoaded", function () {
    console.log('DOCUMENT READY!!');

    // ------------------ 오늘 날짜 ------------------
    let today = new Date();
    let today_year = today.getFullYear();		// 오늘 년도
    let today_month = today.getMonth();		    // 오늘 월(0 ~ 11)
    let today_date = today.getDate();		    // 오늘 일
    let today_day = today.getDay();			    // 오늘 요일(0 ~ 6, 0:일요일)

    // 현재
    setCurrentCalender(today_year, today_month, today_date, today_day);

    // 현재(<select> UI)
    setCurrentYearAndMonthSelectUI();

    // 현재(<tr> UI)
    addCalenderTr();

    // 일정들 가져오기
    fetchGetCurrentMonthPlans();

    // 이벤트 핸들러 등록
    initEvents();

});

// 현재
function setCurrentCalender(year, month, date, day) {
    console.log('setCurrentCalender()');

    current_year = year;
    current_month = month;
    current_date = date;
    current_day = day;

}

// 현재(<select> UI)
function setCurrentYearAndMonthSelectUI() {
	console.log('setCurrentYearAndMonthSelectUI()');

	document.querySelector('#section_wrap select[name="p_year"]').value = current_year;
    document.querySelector('#section_wrap select[name="p_month"]').value = current_month + 1;

}

//현재(<tr> UI)
function addCalenderTr() {
	console.log('addCalenderTr()');

	let thisCalenderStart = new Date(current_year, current_month, 1);
	let thisCalenderStartDate = thisCalenderStart.getDate();			// 현재 월의 첫 날
	let thisCalenderStartDay = thisCalenderStart.getDay();				// 현재 월의 첫 요일

	let thisCalenderEnd = new Date(current_year, current_month + 1, 0);
	let thisCalenderEndDate = thisCalenderEnd.getDate();				// 현재 월의 마지막 날

	// 달력 구성 날짜 데이터
	let dates = Array();
	let dateCnt = 1;
	for (let i = 0; i < 42; i++) {
		if (i < thisCalenderStartDay || dateCnt > thisCalenderEndDate) {
			dates[i] = 0;
		} else {
			dates[i] = dateCnt;
			dateCnt++;
		}
	}

	// GENERATE UI
	let tableBody = document.querySelector('#table_calender tbody');
	tableBody.innerHTML = ''; // 기존 내용 초기화
	let dateIndex = 0;
	for (let i = 0; i < 6; i++) {
		if (i >= 5 && dates[dateIndex] == 0) break;

		let tr = document.createElement('tr');
		for (let j = 0; j < 7; j++) {
			let td = document.createElement('td');

			if (dates[dateIndex] !== 0) {
				// 날짜 UI
				let dateDiv = document.createElement('div');
                dateDiv.className = 'date';
                dateDiv.textContent = dates[dateIndex];
                td.appendChild(dateDiv);

				// 일정 등록 버튼 UI
                let writeDiv = document.createElement('div');
                let writeLink = document.createElement('a');
                writeLink.className = 'write';
                writeLink.href = '#none';
                writeLink.textContent = 'write';
                writeDiv.appendChild(writeLink);
                td.appendChild(writeDiv);

				// 일정 출력 UI
                let planWrap = document.createElement('div');
                planWrap.className = 'plan_wrap';
                planWrap.id = `date_${dates[dateIndex]}`;

                let planList = document.createElement('ul');
                planList.className = 'plan';
                planWrap.appendChild(planList);
                td.appendChild(planWrap);

			}

			tr.appendChild(td);
            dateIndex++;

		}
		tableBody.appendChild(tr);

	}

}

//이벤트 핸들러 설정(등록)
function initEvents() {
	console.log('initEvents()');

    // 'click' 이벤트 핸들러 정의
    document.addEventListener('click', function(event) {
        // 달력에서 이전 달 버튼 클릭 이벤트
        if (event.target.matches('#section_wrap .btn_pre')) {
            console.log("btn_pre CLICKED!!");
            setPreMonth();
        }

        // 달력에서 다음 달 버튼 클릭 이벤트
        if (event.target.matches('#section_wrap .btn_next')) {
            console.log("btn_next CLICKED!!");
            setNextMonth();
        }

        // 달력에서 일정 등록 버튼
        if (event.target.matches('#section_wrap a.write')) {

            let year = current_year;
            let month = current_month + 1;

            let dateElement = event.target.closest("div").parentElement.querySelector("div.date");
            let date = dateElement ? dateElement.textContent.trim() : "";

            showWritePlanView(year, month, date);

        }

        // 일정 등록 모달에서 일정 등록 작성 버튼 클릭 시
        if (event.target.matches('#write_plan input[value="WRITE"]')) {
            console.log("WRITE BUTTON CLICKED!!");

            let year = document.querySelector("#write_plan select[name='wp_year']").value;      // 2025
            let month = document.querySelector("#write_plan select[name='wp_month']").value;    // 4
            let date = document.querySelector("#write_plan select[name='wp_date']").value;      // 9

            let title = document.querySelector("#write_plan input[name='p_title']").value;      // 0409 일정 제목
            let body = document.querySelector("#write_plan input[name='p_body']").value;        // 0409 일정 내용
            let file = document.querySelector("#write_plan input[name='p_file']").value;

            if (title === "") {
                alert("INPUT NEW PLAN TITLE!!");
                document.querySelector("#write_plan input[name='p_title']").focus();
            } else if (body === "") {
                alert("INPUT NEW PLAN BODY!!");
                document.querySelector("#write_plan input[name='p_body']").focus();
            } else if (file === "") {
                alert("SELECT IMAGE FILE!!");
                document.querySelector("#write_plan input[name='p_file']").focus();
            } else {
                let inputFile = document.querySelector("#write_plan input[name='p_file']");
                let files = inputFile.files;

                fetchWritePlan(year, month, date, title, body, files[0]);
            }
        }

        // 일정 등록 모달에서 일정 등록 취소 버튼 클릭 시
        if (event.target.matches('#write_plan input[value="CANCEL"]')) {
            console.log('CANCEL BUTTON CLICKED!!');
            hideWritePlanView();
        }

        // 일정 디테일 모달 보이기
        if (event.target.matches('#table_calender a.title')) {
            console.log('PLAN TITLE CLICKED!!', event.target.getAttribute('data-no'));
            fetchGetPlan(event.target.getAttribute('data-no'));
        }

        // 일정 수정 하기
        if (event.target.matches('#show_plan input[value="MODIFY"]')) {
            console.log('MODIFY BUTTON CLICKED!!');

            let year = document.querySelector('#show_plan select[name="dp_year"]').value;
            let month = document.querySelector('#show_plan select[name="dp_month"]').value;
            let date = document.querySelector('#show_plan select[name="dp_date"]').value;

            let title = document.querySelector('#show_plan input[name="p_title"]').value;
            let body = document.querySelector('#show_plan input[name="p_body"]').value;

            let no = event.target.getAttribute('data-no');

            let fileInput = document.querySelector('#show_plan input[name="p_file"]');
            let file = fileInput.files.length > 0 ? fileInput.files[0] : null;

            fetchModifyPlan(no, year, month, date, title, body, file);

        }

        // 일정 삭제 하기
        if (event.target.matches('#show_plan input[value="DELETE"]')) {
            console.log('DETAIL VIEW DELETE BUTTON CLICKED!!');

            let no = event.target.getAttribute('data-no');
            fetchRemovePlan(no);

        }

        // 일정 디테일 모달에서 모달 닫기
        if (event.target.matches('#show_plan input[value="CLOSE"]')) {
            console.log('DETAIL VIEW CLOSE BUTTON CLICKED!!');

            hideDetailPlanView();

        }

    });

    // 'change' 이벤트 핸들러 정의
    document.addEventListener('change', function(event) {
        // 달력에서 년도 변경 이벤트
        if (event.target.matches('#section_wrap select[name="p_year"]')) {
            console.log("p_year CHANGED!!");
            setMonthBySelectChanged();
        }

        // 달력에서 월 변경 이벤트
        if (event.target.matches('#section_wrap select[name="p_month"]')) {
            console.log("p_month CHANGED!!");
            setMonthBySelectChanged();
        }

        // 일정 등록 모달에서 연도 변경에 따른 일 쎄팅
        if (event.target.matches('#write_plan select[name="wp_year"]')) {
            console.log("wp_year CHANGED!!");

            let year = event.target.value;
            let month = document.querySelector('#write_plan select[name="wp_month"]').value;

            setSelectDateOptions(year, month, 'wp_date');

        }


        // 일정 등록 모달에서 월 변경에 따른 일 쎄팅
        if (event.target.matches('#write_plan select[name="wp_month"]')) {
            console.log("wp_month CHANGED!!");

            let year = document.querySelector('#write_plan select[name="wp_year"]').value;
            let month = event.target.value;

            setSelectDateOptions(year, month, 'wp_date');

        }

    });

}

function setPreMonth() {
	console.log('setPreMonth()');

    let yearSelect = document.querySelector('select[name="p_year"]');
    let monthSelect = document.querySelector('select[name="p_month"]');

    if (yearSelect.value == 2025 && monthSelect.value == 1) {
        alert("2025년 1월 이전은 설정할 수 없습니다.");
        return false;
    }

    let temp_year = current_year;
    let temp_month = current_month - 1;

    if (temp_month <= -1) {
        temp_year -= 1;
        temp_month = 11;
    }

    let preCalender = new Date(temp_year, temp_month, 1);
    setCurrentCalender(
        preCalender.getFullYear(),
        preCalender.getMonth(),
        preCalender.getDate(),
        preCalender.getDay()
    ); // 데이터 설정

    setCurrentYearAndMonthSelectUI(); // <select> UI 업데이트
    removeCalenderTr(); // 기존 <tr> 삭제
    addCalenderTr(); // 새 <tr> 추가
    fetchGetCurrentMonthPlans(); // 일정들 가져오기

}

function setNextMonth() {
    console.log("setNextMonth()");

    let yearSelect = document.querySelector('select[name="p_year"]');
    let monthSelect = document.querySelector('select[name="p_month"]');

    if (yearSelect.value == 2030 && monthSelect.value == 12) {
        alert("2030년 12월 이후는 설정할 수 없습니다.");
        return false;
    }

    let temp_year = current_year;
    let temp_month = current_month + 1;

    if (temp_month >= 12) {
        temp_year += 1;
        temp_month = 0;
    }

    let nextCalender = new Date(temp_year, temp_month, 1);
    setCurrentCalender(
        nextCalender.getFullYear(),
        nextCalender.getMonth(),
        nextCalender.getDate(),
        nextCalender.getDay()
    ); // 데이터 설정

    setCurrentYearAndMonthSelectUI(); // <select> UI 업데이트
    removeCalenderTr(); // 기존 <tr> 삭제
    addCalenderTr(); // 새 <tr> 추가
    fetchGetCurrentMonthPlans(); // 일정들 가져오기

}

function removeCalenderTr() {
    console.log("removeCalenderTr()");

    let tbody = document.querySelector("#table_calender tbody");
    tbody.innerHTML = ''; // tbody 내부의 모든 자식 요소를 제거

}

function setMonthBySelectChanged() {
    console.log("setMonthBySelectChanged()");

    let temp_year = document.querySelector('select[name="p_year"]').value;
    let temp_month = document.querySelector('select[name="p_month"]').value - 1;

    let selectedCalender = new Date(temp_year, temp_month, 1);
    setCurrentCalender(
        selectedCalender.getFullYear(),
        selectedCalender.getMonth(),
        selectedCalender.getDate(),
        selectedCalender.getDay()
    ); // 데이터 설정

    removeCalenderTr(); // 기존 <tr> 삭제
    addCalenderTr(); // 새 <tr> 추가
    fetchGetCurrentMonthPlans(); // 일정들 가져오기

}

function showWritePlanView(year, month, date) {
    console.log('showWritePlanView()');

    document.querySelector('#write_plan select[name="wp_year"]').value = year;
    document.querySelector('#write_plan select[name="wp_month"]').value = month;

    setSelectDateOptions(year, month, 'wp_date');
    document.querySelector('#write_plan select[name="wp_date"]').value = date;

    document.querySelector('#write_plan').style.display = 'block';

}

function hideWritePlanView() {
    console.log('hideWritePlanView()');

    document.querySelector('#write_plan input[name="p_title"]').value = '';
    document.querySelector('#write_plan input[name="p_body"]').value = '';
    document.querySelector('#write_plan input[name="p_file"]').value = '';

    document.getElementById('write_plan').style.display = 'none';

}

function setSelectDateOptions(year, month, select_name) {
    console.log('setSelectDateOptions()');

    // SET DATA
    let last = new Date(year, month, 0);

    // GENERATE UI
    let selectElement = document.querySelector('select[name="' + select_name + '"]');

    // Remove existing options
    selectElement.innerHTML = '';

    // Add new options
    for (let i = 1; i <= last.getDate(); i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectElement.appendChild(option);
    }

}

function showDetailPlanView(plan) {
	console.log('showDetailPlanView()');

    const showPlan = document.querySelector("#show_plan");

	// 값 설정
    showPlan.querySelector('select[name="dp_year"]').value = plan.year;
    showPlan.querySelector('select[name="dp_month"]').value = plan.month;

    setSelectDateOptions(plan.year, plan.month, "dp_date");
    showPlan.querySelector('select[name="dp_date"]').value = plan.date;

    showPlan.querySelector('input[name="p_title"]').value = plan.title;
    showPlan.querySelector('input[name="p_body"]').value = plan.body;

    // 이미지 설정
    let uploadImgURI = `/planUploadImg/${plan.ori_owner_id}/${plan.img_name}`;
    showPlan.querySelector("img.plan_img").src = uploadImgURI;

    // 데이터 속성 설정 (data-* 속성 활용)
    // 모든 input 요소에 data-no="plan.no"를 설정하고,
    showPlan.querySelectorAll("input").forEach(input => input.dataset.no = plan.no);
    // #show_plan 자체에는 data-ori_no="plan.ori_no"를 설정합니다.
    showPlan.dataset.ori_no = plan.ori_no;

    // 모달 표시
    showPlan.style.display = "block";

}

function hideDetailPlanView() {
    console.log('hideDetailPlanView()');

    document.querySelector('#show_plan input[name="p_title"]').value = '';
    document.querySelector('#show_plan input[name="p_body"]').value = '';
    document.querySelector('#show_plan input[name="p_file"]').value = '';

    document.getElementById('show_plan').style.display = 'none';

}