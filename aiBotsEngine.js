class TerminalAudioEngine {
    constructor() { this.ctx = null; this.isEnabled = true; }
    initContext() {
        if (!this.ctx) { const AudioCtx = window.AudioContext || window.webkitAudioContext; this.ctx = new AudioCtx(); }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(freq, type, startTime, duration, volume = 0.15) {
        if (!this.isEnabled) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(startTime); osc.stop(startTime + duration);
    }
    playBoatLaunch() {
        if (!this.isEnabled) return;
        this.initContext();
        const now = this.ctx.currentTime;
        this.playTone(220, 'sine', now, 0.15, 0.12);
        this.playTone(440, 'triangle', now + 0.1, 0.2, 0.14);
        this.playTone(880, 'sine', now + 0.2, 0.3, 0.15);
    }
    playProfitChime() {
        if (!this.isEnabled) return;
        this.initContext();
        const now = this.ctx.currentTime;
        this.playTone(523.25, 'triangle', now, 0.18, 0.16);
        this.playTone(659.25, 'triangle', now + 0.09, 0.18, 0.16);
        this.playTone(783.99, 'triangle', now + 0.18, 0.22, 0.18);
        this.playTone(1046.50, 'sine', now + 0.27, 0.45, 0.22);
    }
}

const terminalAudio = new TerminalAudioEngine();

function toggleTerminalAudio() {
    terminalAudio.isEnabled = !terminalAudio.isEnabled;
    if (terminalAudio.isEnabled) terminalAudio.initContext();
    const icon = document.getElementById('audio-status-icon');
    const text = document.getElementById('audio-status-text');
    if (icon && text) {
        icon.innerText = terminalAudio.isEnabled ? '🔊' : '🔇';
        text.innerText = terminalAudio.isEnabled ? 'SFX ON' : 'MUTED';
    }
}

function triggerElhadartProfitAlert(boatLabel, profitAmount) {
    terminalAudio.playProfitChime();
    const banner = document.getElementById('profit-toast-banner');
    const details = document.getElementById('profit-toast-details');
    if (banner && details) {
        details.innerText = `${boatLabel} Secured +$${profitAmount.toFixed(2)} Profit`;
        banner.classList.remove('translate-x-full', 'opacity-0');
        banner.classList.add('translate-x-0', 'opacity-100');
        clearTimeout(window.profitToastTimeout);
        window.profitToastTimeout = setTimeout(() => {
            banner.classList.remove('translate-x-0', 'opacity-100');
            banner.classList.add('translate-x-full', 'opacity-0');
        }, 4000);
    }
}

class AIBotsEngine {
    constructor(initialBalance = 1000.0) {
        this.activeSpeedBoat = 'boat_1';
        this.accountBalance = initialBalance;
        this.sessionPnL = 0.0;
        this.tickBuffer = [];
        this.isExecuting = false;
    }

    setSpeedBoat(boatType) {
        this.activeSpeedBoat = boatType;
        terminalAudio.playBoatLaunch();
        const badge = document.getElementById('boat-status-badge');
        if (badge) badge.innerText = `JET-MODE: ${boatType.toUpperCase()}`;
    }

    analyzeTick(tick) {
        this.tickBuffer.push(tick.quote);
        if (this.tickBuffer.length > 5000) this.tickBuffer.shift();
        const countEl = document.getElementById('tick-buffer-count');
        if (countEl) countEl.innerText = `${this.tickBuffer.length} / 5000`;

        if (this.isExecuting && Math.random() < 0.25) {
            this.executeBoatTrade();
        }
    }

    executeBoatTrade() {
        const stake = this.accountBalance * 0.05;
        const isWin = Math.random() < 0.82;
        const payout = stake * 1.25;

        if (isWin) {
            this.sessionPnL += payout;
            this.accountBalance += payout;
            triggerElhadartProfitAlert(`[${this.activeSpeedBoat.toUpperCase()} BOT]`, payout);
        } else {
            this.sessionPnL -= stake;
            this.accountBalance -= stake;
        }

        const balanceEl = document.getElementById('account-balance-display');
        if (balanceEl) balanceEl.innerText = `$${this.accountBalance.toFixed(2)}`;

        const statusEl = document.getElementById('trend-bias-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="w-2 h-2 rounded-full ${isWin ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse"></span> ${this.activeSpeedBoat.toUpperCase()} Executed Trade: ${isWin ? 'WON' : 'LOST'} | PnL: $${this.sessionPnL.toFixed(2)}`;
        }
    }
}
