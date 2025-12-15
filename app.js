// ==========================================
// DATA MANAGER - Manejo de localStorage
// ==========================================
const DataManager = {
    // Obtener todos los datos
    getData() {
        return {
            timer: this.getTimerData(),
            subjects: this.getSubjects(),
            exams: this.getExams(),
            goals: this.getGoals(),
            sessions: this.getSessions(),
            gamification: this.getGamification()
        };
    },

    // Timer data
    getTimerData() {
        const data = localStorage.getItem('pomodoroGatito');
        if (data) {
            return JSON.parse(data);
        }
        return {
            completedPomodoros: 0,
            totalMinutes: 0,
            sessionPomodoros: 0
        };
    },

    saveTimerData(data) {
        localStorage.setItem('pomodoroGatito', JSON.stringify(data));
    },

    // Subjects (Materias)
    getSubjects() {
        const data = localStorage.getItem('subjects');
        return data ? JSON.parse(data) : [];
    },

    saveSubjects(subjects) {
        localStorage.setItem('subjects', JSON.stringify(subjects));
    },

    addSubject(subject) {
        const subjects = this.getSubjects();
        subject.id = Date.now();
        subject.createdAt = new Date().toISOString();
        subjects.push(subject);
        this.saveSubjects(subjects);
        return subject;
    },

    deleteSubject(id) {
        let subjects = this.getSubjects();
        subjects = subjects.filter(s => s.id !== id);
        this.saveSubjects(subjects);
    },

    // Exams (Exámenes)
    getExams() {
        const data = localStorage.getItem('exams');
        return data ? JSON.parse(data) : [];
    },

    saveExams(exams) {
        localStorage.setItem('exams', JSON.stringify(exams));
    },

    addExam(exam) {
        const exams = this.getExams();
        exam.id = Date.now();
        exam.createdAt = new Date().toISOString();
        exams.push(exam);
        this.saveExams(exams);
        return exam;
    },

    deleteExam(id) {
        let exams = this.getExams();
        exams = exams.filter(e => e.id !== id);
        this.saveExams(exams);
    },

    // Goals (Metas)
    getGoals() {
        const data = localStorage.getItem('goals');
        return data ? JSON.parse(data) : [];
    },

    saveGoals(goals) {
        localStorage.setItem('goals', JSON.stringify(goals));
    },

    addGoal(goal) {
        const goals = this.getGoals();
        goal.id = Date.now();
        goal.createdAt = new Date().toISOString();
        goal.completed = false;
        goals.push(goal);
        this.saveGoals(goals);
        return goal;
    },

    updateGoal(id, updates) {
        const goals = this.getGoals();
        const index = goals.findIndex(g => g.id === id);
        if (index !== -1) {
            goals[index] = { ...goals[index], ...updates };
            this.saveGoals(goals);
            return goals[index];
        }
        return null;
    },

    deleteGoal(id) {
        let goals = this.getGoals();
        goals = goals.filter(g => g.id !== id);
        this.saveGoals(goals);
    },

    // Sessions (Sesiones de estudio)
    getSessions() {
        const data = localStorage.getItem('sessions');
        return data ? JSON.parse(data) : [];
    },

    saveSessions(sessions) {
        localStorage.setItem('sessions', JSON.stringify(sessions));
    },

    addSession(session) {
        const sessions = this.getSessions();
        session.id = Date.now();
        sessions.push(session);
        this.saveSessions(sessions);
        return session;
    },

    // Gamificación
    getGamification() {
        const data = localStorage.getItem('gamification');
        return data ? JSON.parse(data) : {
            xp: 0,
            level: 1,
            streak: 0,
            lastSessionDate: null,
            achievements: []
        };
    },

    saveGamification(gamification) {
        localStorage.setItem('gamification', JSON.stringify(gamification));
    },

    // Estadísticas
    getStatsByPeriod(period = 'day') {
        const sessions = this.getSessions();
        const now = new Date();
        let startDate;

        switch (period) {
            case 'day':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                const dayOfWeek = now.getDay();
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
        }

        const filtered = sessions.filter(s => new Date(s.date) >= startDate);

        return {
            totalSessions: filtered.length,
            totalMinutes: filtered.reduce((sum, s) => sum + s.duration, 0),
            bySubject: this.groupSessionsBySubject(filtered)
        };
    },

    groupSessionsBySubject(sessions) {
        const grouped = {};
        sessions.forEach(session => {
            if (!grouped[session.subject]) {
                grouped[session.subject] = {
                    count: 0,
                    minutes: 0
                };
            }
            grouped[session.subject].count++;
            grouped[session.subject].minutes += session.duration;
        });
        return grouped;
    }
};

// ==========================================
// DATE PICKER CUSTOM
// ==========================================
class PixelDatePicker {
    constructor(inputId) {
        this.input = document.getElementById(inputId);
        this.container = document.getElementById('datepicker');
        this.monthLabel = document.getElementById('datepickerMonth');
        this.daysContainer = document.getElementById('datepickerDays');
        this.openBtn = document.getElementById('openDatepicker');
        this.viewDate = new Date();
        this.selectedDate = null;
        this.toastTimeout = null;

        if (!this.input || !this.container) return;

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const prev = this.container.querySelector('[data-action="prev"]');
        const next = this.container.querySelector('[data-action="next"]');

        prev?.addEventListener('click', (e) => {
            e.preventDefault();
            this.changeMonth(-1);
        });

        next?.addEventListener('click', (e) => {
            e.preventDefault();
            this.changeMonth(1);
        });

        this.openBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        this.input.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle(true);
        });

        this.container.addEventListener('click', (e) => e.stopPropagation());

        document.addEventListener('click', (e) => {
            if (!this.container.classList.contains('show')) return;
            if (!this.container.contains(e.target) && e.target !== this.input && e.target !== this.openBtn) {
                this.close();
            }
        });

        this.container.querySelectorAll('.datepicker-quick .pixel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'today') this.selectDate(new Date());
                if (action === 'tomorrow') {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    this.selectDate(tomorrow);
                }
            });
        });
    }

    toggle(forceOpen = false) {
        if (this.container.classList.contains('show') && !forceOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.container.classList.add('show');
        this.container.setAttribute('aria-hidden', 'false');
        this.render();
    }

    close() {
        this.container.classList.remove('show');
        this.container.setAttribute('aria-hidden', 'true');
    }

    changeMonth(delta) {
        this.viewDate.setMonth(this.viewDate.getMonth() + delta);
        this.render();
    }

    render() {
        if (!this.monthLabel || !this.daysContainer) return;

        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        this.monthLabel.textContent = this.viewDate.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });

        const firstDay = new Date(year, month, 1);
        const startOffset = (firstDay.getDay() + 6) % 7; // lunes = 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        this.daysContainer.innerHTML = '';

        for (let i = 0; i < startOffset; i++) {
            const placeholder = document.createElement('button');
            placeholder.type = 'button';
            placeholder.className = 'datepicker-day disabled';
            placeholder.disabled = true;
            placeholder.setAttribute('aria-hidden', 'true');
            this.daysContainer.appendChild(placeholder);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'datepicker-day';
            btn.textContent = day;

            if (this.isSameDate(date, new Date())) {
                btn.classList.add('today');
            }

            if (this.selectedDate && this.isSameDate(date, this.selectedDate)) {
                btn.classList.add('selected');
            }

            btn.addEventListener('click', () => this.selectDate(date));
            this.daysContainer.appendChild(btn);
        }
    }

    isSameDate(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();
    }

    formatDisplay(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    toISO(date) {
        return date.toISOString().split('T')[0];
    }

    selectDate(date) {
        this.selectedDate = date;
        const iso = this.toISO(date);
        if (this.input) {
            this.input.value = this.formatDisplay(date);
            this.input.dataset.iso = iso;
        }
        this.close();
        this.render();
    }

    getISOValue() {
        return this.input?.dataset.iso || '';
    }

    clear() {
        if (this.input) {
            this.input.value = '';
            delete this.input.dataset.iso;
        }
        this.selectedDate = null;
        this.viewDate = new Date();
        this.render();
    }
}

// ==========================================
// POMODORO TIMER
// ==========================================
class PomodoroTimer {
    constructor() {
        this.state = {
            timeLeft: 25 * 60,
            totalTime: 25 * 60,
            isRunning: false,
            mode: 'pomodoro',
            completedPomodoros: 0,
            totalMinutes: 0,
            sessionPomodoros: 0,
            interval: null,
            currentSubject: null,
            currentNote: ''
        };

        this.celebrations = [
            { title: '¡INCREÍBLE!', message: '¡Completaste un pomodoro! Los gatitos están bailando de felicidad 💖' },
            { title: '¡GENIAL!', message: '¡Otro pomodoro completado! Sos un/a campeón/a de la concentración 🏆' },
            { title: '¡FANTÁSTICO!', message: '¡Los gatitos te aplauden! Seguí así que vas muy bien 🎀' },
            { title: '¡ASOMBROSO!', message: '¡Qué productividad! Los gatitos te admiran mucho 🌟' },
            { title: '¡ESPECTACULAR!', message: '¡Sos imparable! Los gatitos preparan tu corona 👑' },
            { title: '¡MARAVILLOSO!', message: '¡Otro logro desbloqueado! Los gatitos están muy orgullosos 🎉' },
            { title: '¡BRILLANTE!', message: '¡Tu concentración es legendaria! Los gatitos te celebran 🎊' },
            { title: '¡EXCELENTE!', message: '¡Seguís superándote! Los gatitos hacen la ola por vos 🌊' }
        ];

        this.initElements();
        this.loadState();
        this.updateUI();
        this.setupEventListeners();
        this.updateTitle();
    }

    initElements() {
        this.timerEl = document.getElementById('timer');
        this.timerLabelEl = document.getElementById('timer-label');
        this.progressEl = document.getElementById('progress');
        this.heartsEl = document.getElementById('hearts');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modalEl = document.getElementById('modal');
        this.modalTitleEl = document.getElementById('modalTitle');
        this.modalMessageEl = document.getElementById('modalMessage');
        this.closeModalBtn = document.getElementById('closeModal');
        this.completedPomodorosEl = document.getElementById('completedPomodoros');
        this.totalTimeEl = document.getElementById('totalTime');
        this.sessionInfoEl = document.getElementById('sessionInfo');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.subjectSelectEl = document.getElementById('currentSubject');
        this.sessionNoteEl = document.getElementById('sessionNote');
    }

    loadState() {
        const saved = DataManager.getTimerData();
        this.state.completedPomodoros = saved.completedPomodoros || 0;
        this.state.totalMinutes = saved.totalMinutes || 0;
        this.state.sessionPomodoros = saved.sessionPomodoros || 0;
    }

    saveState() {
        DataManager.saveTimerData({
            completedPomodoros: this.state.completedPomodoros,
            totalMinutes: this.state.totalMinutes,
            sessionPomodoros: this.state.sessionPomodoros
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateUI() {
        this.timerEl.textContent = this.formatTime(this.state.timeLeft);

        const progress = ((this.state.totalTime - this.state.timeLeft) / this.state.totalTime) * 100;
        this.progressEl.style.width = `${progress}%`;

        this.completedPomodorosEl.textContent = this.state.completedPomodoros;
        this.totalTimeEl.textContent = this.state.totalMinutes;

        // Update hearts
        this.heartsEl.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            heart.setAttribute('class', `heart ${i < this.state.sessionPomodoros ? 'filled' : ''}`);
            heart.setAttribute('viewBox', '0 0 16 16');
            heart.innerHTML = `
                <path d="M2 6 L2 4 L4 4 L4 2 L6 2 L6 4 L8 4 L8 2 L10 2 L10 4 L12 4 L12 2 L14 2 L14 6 L12 6 L12 8 L10 8 L10 10 L8 10 L8 12 L6 12 L6 10 L4 10 L4 8 L2 8 Z"
                      fill="${i < this.state.sessionPomodoros ? '#ff8fca' : '#ffb8dd'}"/>
            `;
            this.heartsEl.appendChild(heart);
        }

        this.sessionInfoEl.textContent = `Sesión actual: ${this.state.sessionPomodoros} de 4 pomodoros`;

        // Update labels
        const labels = {
            pomodoro: '¡Hora de concentrarse!',
            short: '¡Descanso corto!',
            long: '¡Descanso largo bien merecido!'
        };
        this.timerLabelEl.textContent = labels[this.state.mode];
    }

    startTimer() {
        if (this.state.isRunning) return;

        this.state.isRunning = true;
        this.startBtn.classList.add('active');

        this.state.interval = setInterval(() => {
            this.state.timeLeft--;

            if (this.state.timeLeft <= 0) {
                this.completeTimer();
            }

            this.updateUI();
        }, 1000);
    }

    pauseTimer() {
        this.state.isRunning = false;
        this.startBtn.classList.remove('active');
        clearInterval(this.state.interval);
    }

    resetTimer() {
        this.pauseTimer();
        const times = { pomodoro: 25, short: 5, long: 15 };
        this.state.timeLeft = times[this.state.mode] * 60;
        this.state.totalTime = this.state.timeLeft;
        this.updateUI();
    }

    completeTimer() {
        this.pauseTimer();
        this.playSound();

        if (this.state.mode === 'pomodoro') {
            this.state.completedPomodoros++;
            this.state.totalMinutes += 25;
            this.state.sessionPomodoros++;

            // Guardar sesión
            const session = {
                date: new Date().toISOString(),
                duration: 25,
                subject: this.state.currentSubject || 'Sin materia',
                note: this.state.currentNote || '',
                type: 'pomodoro'
            };
            DataManager.addSession(session);

            // Show celebration
            const celebration = this.celebrations[Math.floor(Math.random() * this.celebrations.length)];
            this.modalTitleEl.textContent = celebration.title;
            this.modalMessageEl.textContent = celebration.message;
            this.showModal();
            this.createConfetti();

            // Check if session complete (4 pomodoros)
            if (this.state.sessionPomodoros >= 4) {
                this.state.sessionPomodoros = 0;
                setTimeout(() => {
                    this.setMode('long');
                }, 500);
            } else {
                setTimeout(() => {
                    this.setMode('short');
                }, 500);
            }

            this.saveState();

            // Actualizar estadísticas y gamificación en la UI
            if (window.app) {
                window.app.updateStatistics();
                window.app.updateHistory();
                window.app.handlePomodoroCompleted();
            }
        } else {
            // After break, go back to pomodoro
            this.setMode('pomodoro');
        }

        // Limpiar nota después de completar
        this.state.currentNote = '';
        if (this.sessionNoteEl) {
            this.sessionNoteEl.value = '';
        }

        this.updateUI();
    }

    setMode(mode) {
        this.state.mode = mode;
        const times = { pomodoro: 25, short: 5, long: 15 };
        this.state.timeLeft = times[mode] * 60;
        this.state.totalTime = this.state.timeLeft;

        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        this.updateUI();
    }

    showModal() {
        this.modalEl.classList.add('show');
    }

    hideModal() {
        this.modalEl.classList.remove('show');
    }

    createConfetti() {
        const colors = ['#ff8fca', '#ffb8dd', '#d65c9a', '#ffe4f0', '#fff'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }
    }

    playSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);

            // Play three beeps
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();
                osc2.connect(gain2);
                gain2.connect(audioContext.destination);
                osc2.frequency.value = 1000;
                osc2.type = 'sine';
                gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc2.start(audioContext.currentTime);
                osc2.stop(audioContext.currentTime + 0.5);
            }, 200);

            setTimeout(() => {
                const osc3 = audioContext.createOscillator();
                const gain3 = audioContext.createGain();
                osc3.connect(gain3);
                gain3.connect(audioContext.destination);
                osc3.frequency.value = 1200;
                osc3.type = 'sine';
                gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                osc3.start(audioContext.currentTime);
                osc3.stop(audioContext.currentTime + 0.5);
            }, 400);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.closeModalBtn.addEventListener('click', () => this.hideModal());

        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.pauseTimer();
                this.setMode(btn.dataset.mode);
            });
        });

        this.modalEl.addEventListener('click', (e) => {
            if (e.target === this.modalEl) this.hideModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.state.isRunning ? this.pauseTimer() : this.startTimer();
            }
            if (e.code === 'KeyR' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                this.resetTimer();
            }
        });

        // Subject selection
        if (this.subjectSelectEl) {
            this.subjectSelectEl.addEventListener('change', (e) => {
                this.state.currentSubject = e.target.value;
            });
        }

        // Session note
        if (this.sessionNoteEl) {
            this.sessionNoteEl.addEventListener('input', (e) => {
                this.state.currentNote = e.target.value;
            });
        }
    }

    updateTitle() {
        setInterval(() => {
            document.title = `${this.formatTime(this.state.timeLeft)} - 🐱 Pomodoro Gatito`;
        }, 1000);
    }
}

// ==========================================
// APP MANAGER
// ==========================================
class App {
    constructor() {
        this.timer = null;
        this.currentTab = 'exams';
        this.datePicker = null;
        this.toastTimeout = null;
        this.xpPerPomodoro = 25;
        this.xpPerLevel = 100;
        this.achievementsCatalog = [
            { id: 'primer_pomodoro', title: '🎯 Primer Paso', desc: 'Completa tu primer pomodoro.', condition: (ctx) => ctx.timer.completedPomodoros >= 1 },
            { id: 'dia_productivo', title: '🔥 Día Productivo', desc: 'Completa 5 pomodoros en un día.', condition: (ctx) => ctx.dayStats.totalSessions >= 5 },
            { id: 'racha_3', title: '⚡ Racha x3', desc: 'Estudia 3 días seguidos.', condition: (ctx) => ctx.gamification.streak >= 3 },
            { id: 'racha_7', title: '👑 Racha Legendaria', desc: 'Estudia 7 días seguidos.', condition: (ctx) => ctx.gamification.streak >= 7 },
            { id: 'pomodoros_10', title: '💪 Compromiso', desc: 'Completa 10 pomodoros en total.', condition: (ctx) => ctx.timer.completedPomodoros >= 10 },
            { id: 'pomodoros_25', title: '🏆 Maratón 25', desc: 'Completa 25 pomodoros en total.', condition: (ctx) => ctx.timer.completedPomodoros >= 25 },
            { id: 'pomodoros_50', title: '💎 Maestro del Foco', desc: 'Completa 50 pomodoros en total.', condition: (ctx) => ctx.timer.completedPomodoros >= 50 },
            { id: 'nivel_5', title: '⭐ Nivel 5', desc: 'Alcanza el nivel 5.', condition: (ctx) => ctx.gamification.level >= 5 }
        ];
        this.init();
    }

    init() {
        this.timer = new PomodoroTimer();
        this.datePicker = new PixelDatePicker('examDate');
        this.setupTabs();
        this.loadSubjectsToSelect();
        this.loadExams();
        this.loadGoals();
        this.updateStatistics();
        this.updateHistory();
        this.checkReminders();
        this.setupForms();
        this.renderGamification();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;

                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(`${tabName}Tab`).classList.add('active');

                this.currentTab = tabName;
            });
        });
    }

    loadSubjectsToSelect() {
        const subjects = DataManager.getSubjects();
        const select = document.getElementById('currentSubject');
        const examSubjectSelect = document.getElementById('examSubject');
        const goalSubjectSelect = document.getElementById('goalSubject');

        const updateSelect = (selectEl) => {
            if (!selectEl) return;
            selectEl.innerHTML = '<option value="">Seleccionar materia</option>';
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.name;
                option.textContent = subject.name;
                selectEl.appendChild(option);
            });
        };

        updateSelect(select);
        updateSelect(examSubjectSelect);
        updateSelect(goalSubjectSelect);
    }

    loadExams() {
        const exams = DataManager.getExams().sort((a, b) => new Date(a.date) - new Date(b.date));
        const container = document.getElementById('examsList');

        if (exams.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay exámenes registrados</div>';
            return;
        }

        container.innerHTML = '';
        exams.forEach(exam => {
            const item = this.createExamItem(exam);
            container.appendChild(item);
        });
    }

    createExamItem(exam) {
        const div = document.createElement('div');
        div.className = 'list-item';

        const examDate = new Date(exam.date);
        const today = new Date();
        const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

        let badge = '';
        if (daysUntil <= 3 && daysUntil >= 0) {
            badge = '<span class="badge urgent">¡PRÓXIMO!</span>';
        } else if (daysUntil < 0) {
            badge = '<span class="badge">Pasado</span>';
        }

        div.innerHTML = `
            <div class="list-item-title">${exam.subject}</div>
            <div class="list-item-subtitle">
                📅 ${examDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                ${badge}
            </div>
            ${exam.notes ? `<div class="session-note">${exam.notes}</div>` : ''}
            <div class="list-item-actions">
                <button class="pixel-btn small btn-delete" onclick="app.deleteExam(${exam.id})">Eliminar</button>
            </div>
        `;

        return div;
    }

    loadGoals() {
        const goals = DataManager.getGoals();
        const container = document.getElementById('goalsList');

        if (goals.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay metas registradas</div>';
            return;
        }

        container.innerHTML = '';
        goals.forEach(goal => {
            const item = this.createGoalItem(goal);
            container.appendChild(item);
        });
    }

    createGoalItem(goal) {
        const div = document.createElement('div');
        div.className = 'list-item';

        const badge = goal.completed ? '<span class="badge completed">✓ Completada</span>' : '<span class="badge">Pendiente</span>';

        div.innerHTML = `
            <div class="list-item-title">${goal.description}</div>
            <div class="list-item-subtitle">
                📚 ${goal.subject} | 🎯 ${goal.pomodoros} pomodoros
                ${badge}
            </div>
            <div class="list-item-actions">
                ${!goal.completed ? `<button class="pixel-btn small btn-complete" onclick="app.completeGoal(${goal.id})">Completar</button>` : ''}
                <button class="pixel-btn small btn-delete" onclick="app.deleteGoal(${goal.id})">Eliminar</button>
            </div>
        `;

        return div;
    }

    handlePomodoroCompleted() {
        const gamification = DataManager.getGamification();
        const timerData = DataManager.getTimerData();
        const dayStats = DataManager.getStatsByPeriod('day');
        const todayKey = this.getDateKey(new Date());

        // Actualizar racha
        if (!gamification.lastSessionDate) {
            gamification.streak = 1;
        } else {
            const diff = this.getDayDifference(gamification.lastSessionDate, todayKey);
            if (diff === 0) {
                // Misma fecha, no se modifica la racha
            } else if (diff === 1) {
                // Día consecutivo
                gamification.streak += 1;
            } else if (diff > 1) {
                // Se rompió la racha
                gamification.streak = 1;
            }
        }

        gamification.lastSessionDate = todayKey;
        gamification.xp = (gamification.xp || 0) + this.xpPerPomodoro;

        // Calcular nivel: nivel 1 = 0-99 XP, nivel 2 = 100-199 XP, etc.
        const newLevel = Math.floor(gamification.xp / this.xpPerLevel) + 1;
        if (newLevel > (gamification.level || 1)) {
            this.showAchievementToast(`⭐ ¡Subiste al nivel ${newLevel}!`);
        }
        gamification.level = newLevel;
        gamification.achievements = gamification.achievements || [];

        // Verificar logros nuevos
        const unlocked = this.checkAchievements(gamification, { gamification, timer: timerData, dayStats });
        DataManager.saveGamification(gamification);
        this.renderGamification(gamification);

        // Mostrar notificación de logros desbloqueados
        if (unlocked.length > 0) {
            unlocked.forEach(achievement => {
                this.showAchievementToast(`🏆 Logro desbloqueado: ${achievement.title}`);
            });
        }
    }

    getDateKey(date) {
        const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return normalized.toISOString().split('T')[0];
    }

    getDayDifference(lastKey, currentKey) {
        const last = new Date(lastKey);
        const current = new Date(currentKey);
        return Math.floor((current - last) / (1000 * 60 * 60 * 24));
    }

    checkAchievements(gamification, context) {
        const unlocked = [];
        this.achievementsCatalog.forEach(achievement => {
            const already = gamification.achievements.includes(achievement.id);
            if (!already && achievement.condition(context)) {
                gamification.achievements.push(achievement.id);
                unlocked.push(achievement);
            }
        });
        return unlocked;
    }

    renderGamification(gamificationData = DataManager.getGamification()) {
        const levelEl = document.getElementById('levelValue');
        const xpEl = document.getElementById('xpValue');
        const streakEl = document.getElementById('streakValue');
        const xpBar = document.getElementById('xpBar');
        const noteEl = document.getElementById('gamificationNote');

        if (!levelEl || !xpEl || !streakEl || !xpBar) return;

        levelEl.textContent = gamificationData.level || 1;
        xpEl.textContent = `${gamificationData.xp || 0} XP`;
        streakEl.textContent = `${gamificationData.streak || 0}`;

        const xpInLevel = (gamificationData.xp || 0) % this.xpPerLevel;
        const percent = Math.min(100, (xpInLevel / this.xpPerLevel) * 100);
        xpBar.style.width = `${percent}%`;

        if (noteEl) {
            const missing = this.xpPerLevel - xpInLevel;
            if (missing === 0) {
                noteEl.textContent = `¡Felicitaciones! Estás en el nivel ${gamificationData.level}.`;
            } else {
                noteEl.textContent = `Faltan ${missing} XP para el nivel ${gamificationData.level + 1}.`;
            }
        }

        this.renderAchievements(gamificationData);
    }

    renderAchievements(gamificationData) {
        const container = document.getElementById('achievementsList');
        if (!container) return;

        if (!this.achievementsCatalog.length) {
            container.innerHTML = '<div class="empty-state">Sin logros configurados</div>';
            return;
        }

        const unlocked = new Set(gamificationData.achievements || []);
        container.innerHTML = '';

        this.achievementsCatalog.forEach(achievement => {
            const card = document.createElement('div');
            const isUnlocked = unlocked.has(achievement.id);
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
            card.innerHTML = `
                <span class="title">${achievement.title}</span>
                <span class="desc">${achievement.desc}</span>
            `;
            container.appendChild(card);
        });
    }

    showAchievementToast(message, duration = 4000) {
        const toast = document.getElementById('achievementToast');
        if (!toast) return;

        // Si ya hay un toast visible, esperar a que termine
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            toast.classList.remove('show');

            setTimeout(() => {
                this.showAchievementToast(message, duration);
            }, 300);
            return;
        }

        toast.textContent = message;
        toast.classList.add('show');

        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            this.toastTimeout = null;
        }, duration);
    }

    updateStatistics() {
        const periods = ['day', 'week', 'month'];
        periods.forEach(period => {
            const stats = DataManager.getStatsByPeriod(period);
            document.getElementById(`${period}Sessions`).textContent = stats.totalSessions;
            document.getElementById(`${period}Minutes`).textContent = stats.totalMinutes;
        });
    }

    updateHistory() {
        const sessions = DataManager.getSessions().reverse().slice(0, 20);
        const container = document.getElementById('historyList');

        if (sessions.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay sesiones registradas</div>';
            return;
        }

        container.innerHTML = '';
        sessions.forEach(session => {
            const item = this.createHistoryItem(session);
            container.appendChild(item);
        });
    }

    createHistoryItem(session) {
        const div = document.createElement('div');
        div.className = 'list-item';

        const date = new Date(session.date);
        const dateStr = date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        div.innerHTML = `
            <div class="list-item-title">🕐 ${session.duration} minutos - ${session.subject}</div>
            <div class="list-item-subtitle">📅 ${dateStr}</div>
            ${session.note ? `<div class="session-note">📝 ${session.note}</div>` : ''}
        `;

        return div;
    }

    checkReminders() {
        const exams = DataManager.getExams();
        const today = new Date();
        const remindersContainer = document.getElementById('reminders');

        const upcomingExams = exams.filter(exam => {
            const examDate = new Date(exam.date);
            const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
            return daysUntil <= 7 && daysUntil >= 0;
        });

        if (upcomingExams.length > 0) {
            remindersContainer.innerHTML = upcomingExams.map(exam => {
                const examDate = new Date(exam.date);
                const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
                return `
                    <div class="reminder-alert">
                        <strong>⚠ Recordatorio:</strong> Examen de ${exam.subject} en ${daysUntil} día${daysUntil !== 1 ? 's' : ''}
                        (${examDate.toLocaleDateString('es-AR')})
                    </div>
                `;
            }).join('');
        } else {
            remindersContainer.innerHTML = '';
        }
    }

    setupForms() {
        // Agregar materia
        const addSubjectBtn = document.getElementById('addSubject');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => {
                const input = document.getElementById('subjectName');
                const name = input.value.trim();

                if (name) {
                    DataManager.addSubject({ name });
                    input.value = '';
                    this.loadSubjectsToSelect();
                    alert('Materia agregada correctamente');
                }
            });
        }

        // Agregar examen
        const addExamBtn = document.getElementById('addExam');
        if (addExamBtn) {
            addExamBtn.addEventListener('click', () => {
                const subject = document.getElementById('examSubject').value;
                const examDateInput = document.getElementById('examDate');
                const date = this.datePicker ? this.datePicker.getISOValue() : examDateInput.value;
                const notes = document.getElementById('examNotes').value.trim();

                if (subject && date) {
                    DataManager.addExam({ subject, date, notes });
                    document.getElementById('examSubject').value = '';
                    examDateInput.value = '';
                    if (this.datePicker) this.datePicker.clear();
                    document.getElementById('examNotes').value = '';
                    this.loadExams();
                    this.checkReminders();
                    alert('Examen agregado correctamente');
                }
            });
        }

        // Agregar meta
        const addGoalBtn = document.getElementById('addGoal');
        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => {
                const subject = document.getElementById('goalSubject').value;
                const description = document.getElementById('goalDescription').value.trim();
                const pomodoros = parseInt(document.getElementById('goalPomodoros').value);

                if (subject && description && pomodoros) {
                    DataManager.addGoal({ subject, description, pomodoros });
                    document.getElementById('goalSubject').value = '';
                    document.getElementById('goalDescription').value = '';
                    document.getElementById('goalPomodoros').value = '';
                    this.loadGoals();
                    alert('Meta agregada correctamente');
                }
            });
        }
    }

    deleteExam(id) {
        if (confirm('¿Estás seguro de eliminar este examen?')) {
            DataManager.deleteExam(id);
            this.loadExams();
            this.checkReminders();
        }
    }

    deleteGoal(id) {
        if (confirm('¿Estás seguro de eliminar esta meta?')) {
            DataManager.deleteGoal(id);
            this.loadGoals();
        }
    }

    completeGoal(id) {
        DataManager.updateGoal(id, { completed: true });
        this.loadGoals();
    }
}

// Inicializar app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
