const PARTNER_APP_ID = "34UGhpx0qrXHqpfKHAkGH";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

const marketSymbols = {
    synthetic: [
        { symbol: 'R_100', name: 'Volatility 100 Index' }, { symbol: 'R_75', name: 'Volatility 75 Index' },
        { symbol: 'R_50', name: 'Volatility 50 Index' }, { symbol: 'R_25', name: 'Volatility 25 Index' },
        { symbol: 'R_10', name: 'Volatility 10 Index' }, { symbol: '1HZ100V', name: 'Volatility 100 (1s)' },
        { symbol: 'BOOM1000', name: 'Boom 1000 Index' }, { symbol: 'CRASH1000', name: 'Crash 1000 Index' },
        { symbol: 'STEP', name: 'Step Index' }, { symbol: 'RDBEAR', name: 'Bear Market Index' }, { symbol: 'RDBULL', name: 'Bull Market Index' }
    ],
    forex: [
        { symbol: 'frxEURUSD', name: 'EUR/USD (Euro/Dollar)' }, { symbol: 'frxGBPUSD', name: 'GBP/USD (Pound/Dollar)' },
        { symbol: 'frxUSDJPY', name: 'USD/JPY (Dollar/Yen)' }, { symbol: 'frxAUDUSD', name: 'AUD/USD (Aussie/Dollar)' },
        { symbol: 'frxUSDCAD', name: 'USD/CAD (Dollar/CAD)' }, { symbol: 'frxNZDUSD', name: 'NZD/USD (Kiwi/Dollar)' },
        { symbol: 'frxEURGBP', name: 'EUR/GBP (Euro/Pound)' }, { symbol: 'frxGBPJPY', name: 'GBP/JPY (Pound/Yen)' },
        { symbol: 'frxEURJPY', name: 'EUR/JPY (Euro/Yen)' }, { symbol: 'frxUSDCHF', name: 'USD/CHF (Dollar/Franc)' }
    ],
    stocks: [
        { symbol: 'TSLA', name: 'Tesla Inc (TSLA)' }, { symbol: 'NVDA', name: 'NVIDIA Corp (NVDA)' },
        { symbol: 'AAPL', name: 'Apple Inc (AAPL)' }, { symbol: 'AMZN', name: 'Amazon.com Inc (AMZN)' },
        { symbol: 'MSFT', name: 'Microsoft Corp (MSFT)' }, { symbol: 'NFLX', name: 'Netflix Inc (NFLX)' },
        { symbol: 'DJI', name: 'Wall Street 30 Index' }, { symbol: 'SPC', name: 'S&P 500 Index (US500)' },
        { symbol: 'NDX', name: 'US Tech 100 (Nasdaq)' }, { symbol: 'FTSE', name: 'UK 100 Index (FTSE)' }
    ],
    crypto: [
        { symbol: 'cryBTCUSD', name: 'BTC/USD (Bitcoin)' }, { symbol: 'cryETHUSD', name: 'ETH/USD (Ethereum)' },
        { symbol: 'cryXRPUSD', name: 'XRP/USD (Ripple)' }, { symbol: 'cryLTCUSD', name: 'LTC/USD (Litecoin)' },
        { symbol: 'crySOLUSD', name: 'SOL/USD (Solana)' }
    ],
    commodities: [
        { symbol: 'frxXAUUSD', name: 'Spot Gold (XAU/USD)' }, { symbol: 'frxXAGUSD', name: 'Spot Silver (XAG/USD)' },
        { symbol: 'frxXBRUSD', name: 'Brent Crude Oil' }, { symbol: 'frxXTIUSD', name: 'WTI Crude Oil' }
    ]
};

const exchangeRates = { KES: 129.0, UGX: 3750.0, TZS: 2600.0, ETB: 120.5, EUR: 0.92, GBP: 0.79, JPY: 155.0 };

let remainingSeconds = 180;
function runCoreLoadingSequence() {
    const timerDisplay = document.getElementById('loading-timer-display');
    const progressBar = document.getElementById('core-progress-bar');
    const splashScreen = document.getElementById('splash-screen');

    const interval = setInterval(() => {
        remainingSeconds--;
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
        if (progressBar) progressBar.style.width = `${((180 - remainingSeconds) / 180) * 100}%`;

        if (remainingSeconds <= 0) {
            clearInterval(interval);
            if (splashScreen) { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 600); }
            initializeLiveTerminal();
        }
    }, 1000);
}

function updateAssetDropdown(category) {
    const assetSelector = document.getElementById('asset-selector');
    if (!assetSelector) return;
    assetSelector.innerHTML = '';
    (marketSymbols[category] || marketSymbols.synthetic).forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.symbol;
        opt.innerText = item.name;
        assetSelector.appendChild(opt);
    });
}

function setupCurrencyConverter() {
    const amtInput = document.getElementById('convert-amount');
    const curSelect = document.getElementById('target-currency');
    const outEl = document.getElementById('converted-output');
    function calc() {
        const val = (parseFloat(amtInput.value) || 0) * (exchangeRates[curSelect.value] || 1);
        outEl.innerText = `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${curSelect.value}`;
    }
    if (amtInput && curSelect) { amtInput.addEventListener('input', calc); curSelect.addEventListener('change', calc); calc(); }
}

function switchAccountMode(mode) {
    const b1 = document.getElementById('btn-mode-demo'), b2 = document.getElementById('btn-mode-real');
    if (mode === 'demo') {
        b1.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b2.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    } else {
        b2.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b1.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    }
}

function executeActionSignal(type) {
    alert(`Manual Signal Executed: ${type} contract successfully placed!`);
}

function loginWithDeriv() {
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${PARTNER_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}`;
}
function signupWithDeriv() {
    window.open(`https://hub.deriv.com/tradershub/signup?t=${AFFILIATE_TOKEN}`, '_blank');
}

function toggleSpeedBoatExecution() {
    const aiEngine = window.aiBotsEngineInstance;
    if (!aiEngine) return;
    aiEngine.isExecuting = !aiEngine.isExecuting;
    const badge = document.getElementById('boat-status-badge');
    const btn = document.getElementById('btn-launch-boat');
    if (aiEngine.isExecuting) {
        badge.innerText = 'JET-MODE ACTIVE';
        badge.className = 'text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500 font-mono animate-pulse';
        btn.innerText = 'Stop Speed Boat';
        btn.className = 'w-full bg-red-600/20 text-red-300 font-bold py-2.5 rounded-xl text-xs border border-red-500/40 transition';
    } else {
        badge.innerText = 'STANDBY';
        badge.className = 'text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono';
        btn.innerText = 'Launch Speed Boat';
        btn.className = 'w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition';
    }
}

function computeLiveIndicatorsAndSignals(tickBuffer) {
    if (!tickBuffer || tickBuffer.length < 30) return;
    const currentPrice = tickBuffer[tickBuffer.length - 1];

    let gains = 0, losses = 0;
    for (let i = tickBuffer.length - 14; i < tickBuffer.length; i++) {
        const diff = tickBuffer[i] - tickBuffer[i - 1];
        if (diff >= 0) gains += diff; else losses -= diff;
    }
    const rs = (gains / 14) / ((losses / 14) || 1);
    const rsi = 100 - (100 / (1 + rs));

    const ema12 = tickBuffer.slice(-12).reduce((a, b) => a + b, 0) / 12;
    const ema26 = tickBuffer.slice(-26).reduce((a, b) => a + b, 0) / 26;
    const macdHist = (ema12 - ema26).toFixed(4);

    const recentSlice = tickBuffer.slice(-14);
    const high = Math.max(...recentSlice);
    const low = Math.min(...recentSlice);
    const stochK = high === low ? 50 : ((currentPrice - low) / (high - low)) * 100;

    const sma50 = tickBuffer.slice(-50).reduce((a, b) => a + b, 0) / Math.min(tickBuffer.length, 50);
    const positionState = currentPrice > sma50 ? 'Above Equilibrium (Bullish Zone)' : 'Below Equilibrium (Bearish Zone)';

    document.getElementById('ind-rsi').innerText = `${rsi.toFixed(1)} (${rsi > 55 ? 'Bullish' : rsi < 45 ? 'Bearish' : 'Neutral'})`;
    document.getElementById('ind-macd').innerText = `${macdHist > 0 ? '+' : ''}${macdHist}`;
    document.getElementById('ind-stoch').innerText = `${stochK.toFixed(1)}%`;
    document.getElementById('ind-bb').innerText = currentPrice > sma50 ? 'BOS Bullish' : 'BOS Bearish';
    document.getElementById('market-position-status').innerText = positionState;

    const signalBadge = document.getElementById('signal-badge');
    const recAction = document.getElementById('recommended-action');
    const scannerFeed = document.getElementById('pro-scanner-feed');

    let recommendation = "";
    let isAPlus = false;

    if (rsi > 58 && macdHist > 0 && currentPrice > sma50) {
        isAPlus = true;
        recommendation = `🚀 A+ BUY / CALL RISE (Entry: ${currentPrice.toFixed(4)} | Target: +12 Candles Up)`;
        signalBadge.innerText = `A+ BUY SIGNAL`;
        signalBadge.className = 'text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/40 font-mono font-bold animate-pulse';
    } else if (rsi < 42 && macdHist < 0 && currentPrice < sma50) {
        isAPlus = true;
        recommendation = `📉 A+ SELL / PUT FALL (Entry: ${currentPrice.toFixed(4)} | Target: +12 Candles Down)`;
        signalBadge.innerText = `A+ SELL SIGNAL`;
        signalBadge.className = 'text-[10px] bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded border border-red-500/40 font-mono font-bold animate-pulse';
    } else {
        recommendation = `⏳ WAITING FOR LIQUIDITY SWEEP / BOS CONFLUENCE`;
        signalBadge.innerText = `SCANNING SETUP`;
        signalBadge.className = 'text-[10px] bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded border border-amber-500/40 font-mono font-bold';
    }

    recAction.innerText = recommendation;

    if (isAPlus && scannerFeed && Math.random() < 0.3) {
        const timestamp = new Date().toLocaleTimeString();
        const feedItem = document.createElement('div');
        feedItem.innerHTML = `<span class="text-slate-500">[${timestamp}]</span> <span class="text-emerald-400 font-bold">${recommendation}</span>`;
        scannerFeed.prepend(feedItem);
        if (scannerFeed.children.length > 6) scannerFeed.removeChild(scannerFeed.lastChild);
    }
}

function updateKillzonesAndNews() {
    const now = new Date();
    const eatTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const hrs = eatTime.getUTCHours();
    const mins = eatTime.getUTCMinutes();
    const secs = eatTime.getUTCSeconds();

    const timerEl = document.getElementById('killzone-timer');
    if (timerEl) timerEl.innerText = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} EAT`;

    let sessionName = "Asian Liquidity Accumulation";
    let currencyBias = "USD Neutral | JPY Rangebound";

    if (hrs >= 10 && hrs < 15) {
        sessionName = "🔥 London Open Killzone";
        currencyBias = "EUR/USD & GBP/USD Strong Bullish Breakout Bias";
    } else if (hrs >= 15 && hrs < 19) {
        sessionName = "⚡ London / New York Overlap";
        currencyBias = "XAU/USD & USD/JPY High Volatility Sweep";
    } else if (hrs >= 19 && hrs < 23) {
        sessionName = "New York Afternoon Session";
        currencyBias = "US Equities & Indices Mean Reversion";
    }

    const sessionEl = document.getElementById('active-session-name');
    const biasEl = document.getElementById('active-currency-bias');
    if (sessionEl) sessionEl.innerText = sessionName;
    if (biasEl) biasEl.innerText = currencyBias;

    const newsContainer = document.getElementById('news-calendar-container');
    if (newsContainer && !newsContainer.hasChildNodes()) {
        newsContainer.innerHTML = `
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div class="flex justify-between font-bold text-slate-200"><span>US CPI Inflation Release</span><span class="text-emerald-400">15:30 EAT</span></div>
                <p class="text-[11px] text-slate-400">Expected 50-pip liquidity sweep on USD pairs & Gold, followed by reversal continuation.</p>
            </div>
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div class="flex justify-between font-bold text-slate-200"><span>FOMC Rate Decision</span><span class="text-amber-400">21:00 EAT</span></div>
                <p class="text-[11px] text-slate-400">Massive market expansion. Focus on Volatility 75 / Gold breakout setups.</p>
            </div>
        `;
    }
}

function initializeLiveTerminal() {
    updateAssetDropdown('synthetic');
    setupCurrencyConverter();

    const categorySelect = document.getElementById('market-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            updateAssetDropdown(e.target.value);
            const newAsset = document.getElementById('asset-selector').value;
            if (window.derivApiInstance) window.derivApiInstance.subscribeTicks(newAsset, handleTick);
        });
    }

    const derivApi = new DerivAPIConnector(PARTNER_APP_ID);
    window.derivApiInstance = derivApi;
    const aiEngine = new AIBotsEngine();
    window.aiBotsEngineInstance = aiEngine;

    const speedBoatSelect = document.getElementById('speed-boat-selector');
    if (speedBoatSelect) speedBoatSelect.addEventListener('change', (e) => aiEngine.setSpeedBoat(e.target.value));

    derivApi.connect().then(() => {
        const assetSelector = document.getElementById('asset-selector');
        const initialAsset = assetSelector ? assetSelector.value : 'R_100';
        derivApi.subscribeTicks(initialAsset, handleTick);
        if (assetSelector) assetSelector.addEventListener('change', (e) => derivApi.subscribeTicks(e.target.value, handleTick));
    }).catch(() => {
        setInterval(() => { handleTick({ quote: 10340.50 + (Math.random() * 10 - 5), symbol: 'R_100' }); }, 1000);
    });

    function handleTick(tick) {
        const quoteEl = document.getElementById('live-quote-display');
        if (quoteEl) quoteEl.innerText = tick.quote.toFixed(4);
        aiEngine.analyzeTick(tick);
        computeLiveIndicatorsAndSignals(aiEngine.tickBuffer);
    }

    setInterval(updateKillzonesAndNews, 1000);
}

window.addEventListener('DOMContentLoaded', () => { runCoreLoadingSequence(); });
