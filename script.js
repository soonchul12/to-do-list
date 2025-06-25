// 전역 변수로 현재 선택된 날짜 관리
let currentSelectedDate = new Date();
let calendarCurrentDate = new Date(); // 달력에서 표시할 날짜
let selectedCalendarDate = null; // 달력에서 선택된 날짜

// 오늘 날짜를 가져와서 표시하는 함수
function updateTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const dayOfWeek = today.getDay();
    
    // 요일 배열
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    // 날짜 표시 요소들 업데이트
    const dateElements = document.querySelectorAll('.current-date');
    const dayElements = document.querySelectorAll('.current-day');
    
    dateElements.forEach(element => {
        element.textContent = `${year}년 ${month}월 ${date}일`;
    });
    
    dayElements.forEach(element => {
        element.textContent = daysOfWeek[dayOfWeek];
    });
}

// 선택된 날짜를 화면에 표시하는 함수
function updateSelectedDate() {
    const dateInfo = formatDateKorean(currentSelectedDate);
    
    // 날짜 표시 요소들 업데이트
    const dateElements = document.querySelectorAll('.current-date');
    const dayElements = document.querySelectorAll('.current-day');
    
    dateElements.forEach(element => {
        element.textContent = dateInfo.date;
    });
    
    dayElements.forEach(element => {
        element.textContent = dateInfo.day;
    });
    
    // 미니 캘린더 업데이트
    renderMiniCalendar();
}

// 날짜를 문자열로 변환하는 함수 (YYYY-MM-DD 형식)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 날짜를 한국어 형식으로 표시하는 함수
function formatDateKorean(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    return {
        date: `${year}년 ${month}월 ${day}일`,
        day: daysOfWeek[dayOfWeek]
    };
}

// 달력 모달 열기
function openCalendarModal() {
    const modal = document.getElementById('calendarModal');
    calendarCurrentDate = new Date(currentSelectedDate); // 현재 선택된 날짜로 초기화
    selectedCalendarDate = new Date(currentSelectedDate);
    renderCalendar();
    modal.classList.remove('hidden');
}

// 달력 모달 닫기
function closeCalendarModal() {
    const modal = document.getElementById('calendarModal');
    modal.classList.add('hidden');
}

// 달력 렌더링
function renderCalendar() {
    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();
    
    // 월/년도 표시 업데이트
    const monthYearElement = document.querySelector('.current-month-year');
    monthYearElement.textContent = `${year}년 ${month + 1}월`;
    
    // 달력 그리드 생성
    const calendarDaysElement = document.getElementById('calendarDays');
    calendarDaysElement.innerHTML = '';
    
    // 해당 월의 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 일요일부터 시작
    
    // 오늘 날짜
    const today = new Date();
    const isToday = (date) => {
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    };
    
    // 선택된 날짜 확인
    const isSelected = (date) => {
        return selectedCalendarDate && 
               date.getDate() === selectedCalendarDate.getDate() && 
               date.getMonth() === selectedCalendarDate.getMonth() && 
               date.getFullYear() === selectedCalendarDate.getFullYear();
    };
    
    // 현재 월의 날짜인지 확인
    const isCurrentMonth = (date) => {
        return date.getMonth() === month;
    };
    
    // 6주 (42일) 렌더링
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'text-center py-2 cursor-pointer rounded-lg transition-all duration-200 font-medium';
        
        // 날짜 텍스트
        dayElement.textContent = currentDate.getDate();
        
        // 스타일 적용
        if (isToday(currentDate)) {
            dayElement.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'text-white', 'font-bold', 'shadow-lg');
        } else if (isSelected(currentDate)) {
            dayElement.classList.add('bg-purple-600', 'text-white', 'font-semibold', 'shadow-md');
        } else if (isCurrentMonth(currentDate)) {
            dayElement.classList.add('text-white', 'hover:bg-gray-700', 'hover:shadow-md');
        } else {
            dayElement.classList.add('text-gray-500', 'hover:bg-gray-700', 'hover:text-gray-300');
        }
        
        // 클릭 이벤트
        dayElement.addEventListener('click', () => {
            selectedCalendarDate = new Date(currentDate);
            renderCalendar();
        });
        
        calendarDaysElement.appendChild(dayElement);
    }
}

// 달력에서 이전 월로 이동
function goToPreviousMonth() {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
    renderCalendar();
}

// 달력에서 다음 월로 이동
function goToNextMonth() {
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
    renderCalendar();
}

// 달력에서 선택한 날짜 적용
function applySelectedDate() {
    if (selectedCalendarDate) {
        currentSelectedDate = new Date(selectedCalendarDate);
        updateSelectedDate();
        displayTodos(currentSelectedDate);
        updateTodoCounter();
    }
    closeCalendarModal();
}

// 날짜 이동 함수들
function goToPreviousDay() {
    currentSelectedDate.setDate(currentSelectedDate.getDate() - 1);
    updateSelectedDate();
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

function goToNextDay() {
    currentSelectedDate.setDate(currentSelectedDate.getDate() + 1);
    updateSelectedDate();
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

function goToToday() {
    currentSelectedDate = new Date();
    updateSelectedDate();
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

// 로컬 스토리지에서 할 일 목록 가져오기
function getTodosFromStorage(date) {
    const dateKey = formatDate(date);
    const todos = localStorage.getItem(`todos_${dateKey}`);
    return todos ? JSON.parse(todos) : [];
}

// 로컬 스토리지에 할 일 목록 저장하기
function saveTodosToStorage(date, todos) {
    const dateKey = formatDate(date);
    localStorage.setItem(`todos_${dateKey}`, JSON.stringify(todos));
}

// 할 일 목록을 화면에 표시하는 함수
function displayTodos(date) {
    const todos = getTodosFromStorage(date);
    const todoListContainer = document.querySelector('.todo-list-container');
    
    if (todos.length === 0) {
        // 할 일이 없을 때 빈 상태 표시
        todoListContainer.innerHTML = `
            <div class="glass bg-white/10 rounded-2xl shadow-2xl p-12 text-center border border-white/20">
                <div class="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                    <svg class="w-12 h-12 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                </div>
                <h3 class="text-2xl font-semibold text-white mb-3">할 일이 없습니다</h3>
                <p class="text-purple-200 text-lg">새로운 할 일을 추가해보세요! 🚀</p>
            </div>
        `;
        return;
    }
    
    // 할 일 목록 생성
    let todoListHTML = '';
    todos.forEach((todo, index) => {
        const todoClass = todo.completed ? 'glass bg-green-500/10 rounded-xl shadow-xl p-6 border border-green-500/20 opacity-75' : 'glass bg-white/10 rounded-xl shadow-xl p-6 hover:bg-white/15 transition-all duration-300 border border-white/20 group';
        const textClass = todo.completed ? 'flex-1 text-green-200 font-medium text-lg line-through' : 'flex-1 text-white font-medium text-lg';
        const checkboxColor = todo.completed ? 'text-green-500' : 'text-purple-500';
        const buttonColor = todo.completed ? 'text-green-300 hover:text-red-300' : 'text-purple-300 hover:text-red-300';
        
        todoListHTML += `
            <div class="${todoClass}">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} class="w-6 h-6 ${checkboxColor} rounded-lg focus:ring-purple-400 focus:ring-2 bg-white/20 border-white/30" data-index="${index}">
                    </div>
                    <span class="${textClass}">${todo.text}</span>
                    <button class="${buttonColor} transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110 delete-btn" data-index="${index}">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    });
    
    todoListContainer.innerHTML = todoListHTML;
    
    // 이벤트 리스너 추가
    addTodoEventListeners();
}

// 할 일 추가 함수
function addTodo(text) {
    if (!text.trim()) return;
    
    const todos = getTodosFromStorage(currentSelectedDate);
    const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodosToStorage(currentSelectedDate, todos);
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

// 할 일 삭제 함수
function deleteTodo(index) {
    const todos = getTodosFromStorage(currentSelectedDate);
    todos.splice(index, 1);
    saveTodosToStorage(currentSelectedDate, todos);
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

// 할 일 완료 상태 토글 함수
function toggleTodo(index) {
    const todos = getTodosFromStorage(currentSelectedDate);
    todos[index].completed = !todos[index].completed;
    saveTodosToStorage(currentSelectedDate, todos);
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

// 완료된 할 일 모두 삭제 함수
function deleteCompletedTodos() {
    const todos = getTodosFromStorage(currentSelectedDate);
    const filteredTodos = todos.filter(todo => !todo.completed);
    saveTodosToStorage(currentSelectedDate, filteredTodos);
    displayTodos(currentSelectedDate);
    updateTodoCounter();
}

// 할 일 카운터 업데이트 함수
function updateTodoCounter() {
    const todos = getTodosFromStorage(currentSelectedDate);
    const totalCount = todos.length;
    const completedCount = todos.filter(todo => todo.completed).length;
    
    const counterElement = document.querySelector('.todo-counter');
    if (counterElement) {
        counterElement.innerHTML = `
            <span class="text-purple-200 font-medium">총 <span class="font-bold text-white">${totalCount}</span>개의 할 일</span>
            ${completedCount > 0 ? `<span class="text-green-300 ml-2">(완료: ${completedCount})</span>` : ''}
        `;
    }
}

// 이벤트 리스너 추가 함수
function addTodoEventListeners() {
    // 체크박스 이벤트
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            toggleTodo(index);
        });
    });
    
    // 삭제 버튼 이벤트
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            deleteTodo(index);
        });
    });
}

// 미니 캘린더 렌더링
function renderMiniCalendar() {
    const year = currentSelectedDate.getFullYear();
    const month = currentSelectedDate.getMonth();
    
    // 월/년도 표시 업데이트
    const monthYearElement = document.querySelector('.mini-calendar-month-year');
    if (monthYearElement) {
        monthYearElement.textContent = `${year}년 ${month + 1}월`;
    }
    
    // 미니 캘린더 그리드 생성
    const miniCalendarDaysElement = document.getElementById('miniCalendarDays');
    if (!miniCalendarDaysElement) return;
    
    miniCalendarDaysElement.innerHTML = '';
    
    // 해당 월의 첫 번째 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 일요일부터 시작
    
    // 오늘 날짜
    const today = new Date();
    const isToday = (date) => {
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
    };
    
    // 선택된 날짜 확인
    const isSelected = (date) => {
        return date.getDate() === currentSelectedDate.getDate() && 
               date.getMonth() === currentSelectedDate.getMonth() && 
               date.getFullYear() === currentSelectedDate.getFullYear();
    };
    
    // 현재 월의 날짜인지 확인
    const isCurrentMonth = (date) => {
        return date.getMonth() === month;
    };
    
    // 6주 (42일) 렌더링
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'text-center py-1 cursor-pointer rounded text-xs font-medium transition-all duration-200';
        
        // 날짜 텍스트
        dayElement.textContent = currentDate.getDate();
        
        // 스타일 적용
        if (isToday(currentDate) && isSelected(currentDate)) {
            // 오늘이면서 선택된 날짜 (오늘)
            dayElement.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'text-white', 'font-bold', 'ring-2', 'ring-white');
        } else if (isToday(currentDate)) {
            // 오늘 날짜
            dayElement.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'text-white', 'font-bold');
        } else if (isSelected(currentDate)) {
            // 선택된 날짜
            dayElement.classList.add('bg-purple-600', 'text-white', 'font-semibold', 'ring-2', 'ring-purple-300');
        } else if (isCurrentMonth(currentDate)) {
            // 현재 월의 날짜
            dayElement.classList.add('text-white', 'hover:bg-white/20');
        } else {
            // 다른 월의 날짜
            dayElement.classList.add('text-gray-500', 'hover:bg-white/10');
        }
        
        // 클릭 이벤트
        dayElement.addEventListener('click', () => {
            currentSelectedDate = new Date(currentDate);
            updateSelectedDate();
            displayTodos(currentSelectedDate);
            updateTodoCounter();
            renderMiniCalendar(); // 미니 캘린더 다시 렌더링
        });
        
        miniCalendarDaysElement.appendChild(dayElement);
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 오늘 날짜로 초기화
    currentSelectedDate = new Date();
    updateSelectedDate();
    displayTodos(currentSelectedDate);
    updateTodoCounter();
    
    // 날짜 네비게이션 이벤트 리스너
    const prevButton = document.querySelector('.prev-day-btn');
    const nextButton = document.querySelector('.next-day-btn');
    const todayButton = document.querySelector('.today-btn');
    
    if (prevButton) {
        prevButton.addEventListener('click', goToPreviousDay);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', goToNextDay);
    }
    
    if (todayButton) {
        todayButton.addEventListener('click', goToToday);
    }
    
    // 달력 관련 이벤트 리스너
    const calendarBtn = document.querySelector('.calendar-btn');
    const closeCalendarBtn = document.querySelector('.close-calendar-btn');
    const prevMonthBtn = document.querySelector('.prev-month-btn');
    const nextMonthBtn = document.querySelector('.next-month-btn');
    const selectDateBtn = document.querySelector('.select-date-btn');
    
    if (calendarBtn) {
        calendarBtn.addEventListener('click', openCalendarModal);
    }
    
    if (closeCalendarBtn) {
        closeCalendarBtn.addEventListener('click', closeCalendarModal);
    }
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', goToPreviousMonth);
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', goToNextMonth);
    }
    
    if (selectDateBtn) {
        selectDateBtn.addEventListener('click', applySelectedDate);
    }
    
    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeCalendarModal();
            }
        });
    }
    
    // 할 일 추가 버튼 이벤트
    const addButton = document.querySelector('.add-todo-btn');
    const todoInput = document.querySelector('.todo-input');
    
    addButton.addEventListener('click', function() {
        const todoText = todoInput.value;
        addTodo(todoText);
        todoInput.value = '';
        todoInput.focus();
    });
    
    // Enter 키 이벤트
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const todoText = this.value;
            addTodo(todoText);
            this.value = '';
        }
    });
    
    // 완료된 일 지우기 버튼 이벤트
    const deleteCompletedBtn = document.querySelector('.delete-completed-btn');
    deleteCompletedBtn.addEventListener('click', deleteCompletedTodos);
}); 