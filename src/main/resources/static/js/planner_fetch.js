// 일정 등록 하기
async function fetchWritePlan(year, month, date, title, body, file) {
    console.log('fetchWritePlan()');

    let reqFormData = new FormData();
    reqFormData.append("year", year);
    reqFormData.append("month", month);
    reqFormData.append("date", date);
    reqFormData.append("title", title);
    reqFormData.append("body", body);
    reqFormData.append("file", file);

    try {
        let response = await fetch('/planner/plan', {
            method: 'POST',
            body: reqFormData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('fetchWritePlan() COMMUNICATION SUCCESS!!');
        let data = await response.json();
        if (!data || data.result <= 0) {
            alert('일정 등록에 문제가 발생 했습니다.');

        } else {
            alert('일정이 정상적으로 등록 되었습니다.');
            removeCalenderTr(); // 기존 <tr> 삭제
            addCalenderTr(); // 새 <tr> 추가
            fetchGetCurrentMonthPlans();

        }

    } catch (error) {
        console.error('fetchWritePlan() COMMUNICATION ERROR!!', error);
        alert('일정 등록에 문제가 발생 했습니다.');

    } finally {
        console.log('fetchWritePlan() COMMUNICATION COMPLETE!!');
        hideWritePlanView();

    }
}

// 일정들 가져오기
async function fetchGetCurrentMonthPlans() {        // 2025/04
    console.log('fetchGetCurrentMonthPlans()');

    let reqData = {
        year: current_year,
        month: current_month + 1
    };

    let queryString = new URLSearchParams(reqData).toString();

    try {
        let response = await fetch(`/planner/plans?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        console.log('fetch_getCurrentMonthPlans() COMMUNICATION SUCCESS!!');

        let plans = data.plans;
        console.log('plans: ', plans);

        plans.forEach(dto => {
            let appendTag = `<li><a class="title" href="#none" data-no="${dto.no}">${dto.title}</a></li>`;
            let targetElement = document.querySelector(`#date_${dto.date} ul.plan`);
            if (targetElement) {
                // insertAdjacentHTML('beforeend', ...)은 요소의 마지막 자식으로 새로운 HTML을 삽입하는 기능입니다.
                targetElement.insertAdjacentHTML('beforeend', appendTag);
            }

        });

    } catch (error) {
        console.error('fetch_getCurrentMonthPlans() COMMUNICATION ERROR!!', error);

    }

}

// 일정 가져오기
async function fetchGetPlan(no) {
    console.log('fetchGetPlan()');

    let reqData = new URLSearchParams({ 'no': no });

    try {
        let response = await fetch(`/planner/plan?${reqData.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        console.log("fetchGetPlan() COMMUNICATION SUCCESS!!");

        showDetailPlanView(data.plan);

    } catch (error) {
        console.error("fetchGetPlan() COMMUNICATION ERROR!!", error);

    }

}

// 일정 수정 하기
async function fetchModifyPlan(no, year, month, date, title, body, file) {
    console.log('fetchModifyPlan()');

    let formData = new FormData();
    formData.append("year", year);
    formData.append("month", month);
    formData.append("date", date);
    formData.append("title", title);
    formData.append("body", body);

    if (file != undefined) {
        formData.append("file", file);
    }

    try {
        let response = await fetch(`/planner/plan/${no}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        console.log('fetchModifyPlan() COMMUNICATION SUCCESS!!');

        if (!data || data.result <= 0) {
            alert('일정 수정에 문제가 발생했습니다.');
        } else {
            alert('일정이 정상적으로 수정되었습니다.');
        }

        removeCalenderTr();
        addCalenderTr();
        fetchGetCurrentMonthPlans();

    } catch (error) {
        console.error('fetchModifyPlan() COMMUNICATION ERROR!!');
        alert('일정 수정에 문제가 발생했습니다.');

    } finally {
        console.log('fetchModifyPlan() COMMUNICATION COMPLETE!!');
        hideDetailPlanView();

    }

}

// 일정 삭제 하기
async function fetchRemovePlan(no) {
    console.log('fetchRemovePlan()');

    try {
        let response = await fetch(`/planner/plan/${no}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await response.json();
        console.log('fetchRemovePlan() COMMUNICATION SUCCESS!!');

        if (data.result > 0) {
            alert('일정이 정상적으로 삭제되었습니다.');

            removeCalenderTr();
            addCalenderTr();
            fetchGetCurrentMonthPlans();

        } else {
            alert('일정 삭제에 문제가 발생했습니다. 다시 시도해 주세요.');
        }

    } catch (error) {
        console.error('fetchRemovePlan() COMMUNICATION ERROR!!', error);
        alert('일정 삭제 중 오류가 발생했습니다.');

    } finally {
        console.log('fetchRemovePlan() COMMUNICATION COMPLETE!!');
        hideDetailPlanView();

    }

}