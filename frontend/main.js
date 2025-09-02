// Türkiye'nin 81 ili
const cities = [
    "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın","Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul","İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir","Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat","Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt","Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova","Karabük","Kilis","Osmaniye","Düzce"
];

const methods = [
    { value: 'interp', name: 'Interpolation', desc: 'Produces estimated values between data points. Calculates intermediate values for temperature, humidity, or wind data.' },
    { value: 'error', name: 'Error Analysis', desc: 'Analyzes errors and deviations in numerical operations.' },
    { value: 'diff', name: 'Numerical Differentiation', desc: 'Calculates the rate of change of data (e.g., temperature change rate).' },
    { value: 'integral', name: 'Numerical Integration', desc: 'Calculates the area under the data (e.g., total heat accumulation).' },
    { value: 'root', name: 'Root Finding', desc: 'Finds the points where the data is zero (e.g., when wind speed is zero).' },
    { value: 'linear', name: 'Linear System', desc: 'Solves systems of linear equations.' },
    { value: 'lu', name: 'LU Decomposition', desc: 'Performs LU decomposition for matrix solutions.' },
    { value: 'opt', name: 'Optimization', desc: 'Finds minimum or maximum values for a function.' },
    { value: 'ode', name: 'ODE Solving', desc: 'Solves ordinary differential equations.' },
    { value: 'perf', name: 'Performance & Error Handling', desc: 'Tests performance and error handling in numerical methods.' },
    { value: 'viz', name: 'Visualization', desc: 'Visualizes data and results.' },
    { value: 'comp', name: 'Comparative Analysis', desc: 'Compares different numerical methods on the same data.' }
];

const API_KEY = '50c4843a0926fa5434d33f5c73f2ff80';

function fadeOut(el, cb) {
    el.style.opacity = 1;
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = 0;
    setTimeout(() => { 
        el.style.display = 'none'; 
        if(cb) cb(); 
    }, 500);
}

function fadeIn(el) {
    el.style.display = '';
    el.style.opacity = 0;
    el.style.transition = 'opacity 0.5s';
    setTimeout(() => { 
        el.style.opacity = 1; 
    }, 10);
}

document.addEventListener('DOMContentLoaded', () => {
    // Şehir dropdown doldur
    const citySel = document.getElementById('city-select');
    cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        citySel.appendChild(opt);
    });
    
    // Yöntem butonları oluştur
    const methodContainer = document.getElementById('method-buttons');
    let selectedMethod = null;
    
    methods.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'method-btn';
        btn.textContent = m.name;
        btn.dataset.method = m.value;
        btn.dataset.desc = m.desc;
        
        btn.addEventListener('click', () => {
            // Önceki seçimi temizle
            document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
            // Bu butonu aktif yap
            btn.classList.add('active');
            selectedMethod = m.value;
            
            // Açıklama kutusu güncelle
            const descBox = document.getElementById('method-desc');
            descBox.textContent = m.desc;
            
            // Analizi direkt çalıştır
            drawAnalysisChart(selectedMethod);
        });
        
        methodContainer.appendChild(btn);
    });
    
    // Açıklama kutusu
    const descBox = document.getElementById('method-desc');

    // Şehir seçilince analiz ekranına geç
    citySel.addEventListener('change', async function() {
        if (!this.value) return;
        fadeOut(document.getElementById('city-select-screen'), async () => {
            fadeIn(document.getElementById('analysis-screen'));
            await showWeather(this.value);
        });
    });

    // Başka şehir seç butonu
    document.getElementById('select-another-city').addEventListener('click', () => {
        fadeOut(document.getElementById('analysis-screen'), () => {
            fadeIn(document.getElementById('city-select-screen'));
            // Şehir seçimini sıfırla
            document.getElementById('city-select').value = '';
            // Method seçimini sıfırla
            document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
            selectedMethod = null;
            // Açıklama kutusunu temizle
            document.getElementById('method-desc').textContent = '';
            // Canvas'ı gizle
            document.getElementById('analysis-chart').style.display = 'none';
            // Chart'ı temizle
            if (window.analysisChartInstance) {
                window.analysisChartInstance.destroy();
                window.analysisChartInstance = null;
            }
        });
    });
});

async function showWeather(city) {
    document.getElementById('city-name').textContent = city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},TR&appid=${API_KEY}&units=metric&lang=tr`;
    const res = await fetch(url);
    const data = await res.json();
    // Weather info
    document.getElementById('temp').textContent = `🌡️ ${data.main.temp} °C`;
    document.getElementById('humidity').textContent = `💧 ${data.main.humidity} %`;
    document.getElementById('wind').textContent = `💨 ${data.wind.speed} m/s`;
    window._weatherData = data;
    
    // Sol panelde varsayılan mesaj göster
    document.getElementById('method-desc').textContent = 'Please select an operation';
    
    // Canvas'ı gizle
    document.getElementById('analysis-chart').style.display = 'none';
}

function drawAnalysisChart(method) {
    const data = window._weatherData;
    if (!data) return;
    const ctx = document.getElementById('analysis-chart').getContext('2d');
    if (window.analysisChartInstance) window.analysisChartInstance.destroy();
    let chartData = {};
    if (method === 'interp') {
        // Sıcaklık interpolasyonu örneği
        const x = [0,1,2,3,4,5];
        const y = [data.main.temp-2, data.main.temp-1, data.main.temp, data.main.temp+1, data.main.temp+2, data.main.temp+3];
        const xnew = Array.from({length: 21}, (_, i) => i*0.25);
        const lin = xnew.map(xi => {
            if (xi <= 0) return y[0];
            if (xi >= 5) return y[5];
            let j = x.findIndex(xx => xx > xi) - 1;
            let t = (xi - x[j]) / (x[j+1] - x[j]);
            return y[j] + t * (y[j+1] - y[j]);
        });
        chartData = {
            labels: xnew.map(xi => xi.toFixed(2)),
            datasets: [
                {label: 'Lineer Interpolasyon', data: lin, borderColor: 'orange', backgroundColor: 'rgba(255,140,0,0.2)', fill: true},
                {label: 'Veri', data: xnew.map((xi,i) => x.includes(xi) ? y[x.indexOf(xi)] : null), borderColor: 'red', backgroundColor: 'red', fill: false, pointRadius: 4, showLine: false}
            ]
        };
    } else if (method === 'error') {
        // Hata analizi örneği
        const errors = [0, 1e-16, 2e-16, 4e-16, 8e-16, 1.6e-15, 3.2e-15, 6.4e-15, 1.28e-14, 2.56e-14, 5.12e-14];
        chartData = {
            labels: errors.map((_, i) => i),
            datasets: [{label: 'Hata', data: errors, borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.2)', fill: true}]
        };
    } else if (method === 'diff') {
        // Türev örneği
        const x = Array.from({length: 11}, (_, i) => i);
        const y = x.map(xi => Math.sin(xi));
        const h = 1;
        const dy_forward = y.slice(1).map((v,i) => (v - y[i])/h);
        chartData = {
            labels: x.slice(0, -1),
            datasets: [
                {label: 'Forward', data: dy_forward, borderColor: 'purple', backgroundColor: 'rgba(128,0,128,0.2)', fill: false},
                {label: 'f(x)', data: y.slice(0, -1), borderColor: 'gray', backgroundColor: 'gray', fill: false, borderDash: [5,5]}
            ]
        };
    } else if (method === 'integral') {
        // İntegral örneği
        const x = Array.from({length: 11}, (_, i) => i);
        const y = x.map(xi => Math.sin(xi));
        let area = 0;
        for (let i = 0; i < x.length-1; i++) area += (y[i]+y[i+1])/2;
        chartData = {
            labels: x,
            datasets: [
                {label: 'f(x)', data: y, borderColor: 'aqua', backgroundColor: 'rgba(0,255,255,0.2)', fill: true}
            ]
        };
    } else if (method === 'root') {
        // Kök bulma örneği
        const x = [1, 1.25, 1.5, 1.75, 2];
        const y = x.map(xi => Math.pow(xi,3) - xi - 2);
        chartData = {
            labels: x.map(xi => xi.toFixed(2)),
            datasets: [{label: 'f(x) = x^3 - x - 2', data: y, borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.2)', fill: true}]
        };
    } else if (method === 'linear') {
        // Linear system example (dummy data)
        const x = [1, 2, 3];
        const y = [2, 4, 6];
        chartData = {
            labels: x,
            datasets: [{label: 'Linear System Solution', data: y, borderColor: 'lime', backgroundColor: 'rgba(0,255,0,0.2)', fill: false}]
        };
    } else if (method === 'lu') {
        // LU decomposition example (dummy data)
        const x = [1, 2, 3];
        const y = [1, 0.5, 0.2];
        chartData = {
            labels: x,
            datasets: [{label: 'LU Decomposition', data: y, borderColor: 'gold', backgroundColor: 'rgba(255,215,0,0.2)', fill: false}]
        };
    } else if (method === 'opt') {
        // Optimization example (dummy data)
        const x = [-2, -1, 0, 1, 2];
        const y = x.map(xi => (xi-1)**2 + 2);
        chartData = {
            labels: x,
            datasets: [{label: 'Optimization', data: y, borderColor: 'magenta', backgroundColor: 'rgba(255,0,255,0.2)', fill: false}]
        };
    } else if (method === 'ode') {
        // ODE solving example (dummy data)
        const x = Array.from({length: 20}, (_, i) => i);
        const y = x.map(t => 20 + 10*Math.exp(-0.1*t));
        chartData = {
            labels: x,
            datasets: [{label: 'ODE Solution', data: y, borderColor: 'cyan', backgroundColor: 'rgba(0,255,255,0.2)', fill: false}]
        };
    } else if (method === 'perf') {
        // Performance & Error Handling example (dummy data)
        const x = Array.from({length: 10}, (_, i) => i);
        const y = x.map(i => Math.random()*100);
        chartData = {
            labels: x,
            datasets: [{label: 'Performance', data: y, borderColor: 'gray', backgroundColor: 'rgba(128,128,128,0.2)', fill: false}]
        };
    } else if (method === 'viz') {
        // Visualization example (dummy data)
        const x = Array.from({length: 20}, (_, i) => i);
        const y = x.map(i => Math.sin(i/3));
        chartData = {
            labels: x,
            datasets: [{label: 'Visualization', data: y, borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.2)', fill: false}]
        };
    } else if (method === 'comp') {
        // Comparative Analysis example (dummy data)
        const x = [0,1,2,3,4,5];
        const y1 = [15, 17, 20, 22, 21, 19];
        const y2 = [15, 16, 19, 21, 20, 18];
        chartData = {
            labels: x,
            datasets: [
                {label: 'Method 1', data: y1, borderColor: 'orange', backgroundColor: 'rgba(255,140,0,0.2)', fill: false},
                {label: 'Method 2', data: y2, borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.2)', fill: false}
            ]
        };
    }
    document.getElementById('analysis-chart').style.display = 'block';
    window.analysisChartInstance = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: 'black' } }
            },
            scales: {
                x: { ticks: { color: 'black' } },
                y: { ticks: { color: 'black' } }
            }
        }
    });
}
