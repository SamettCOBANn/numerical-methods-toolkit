// OpenWeatherMap API anahtarınızı buraya ekleyin
const API_KEY = '50c4843a0926fa5434d33f5c73f2ff80';

function getCityFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('city');
}

document.addEventListener('DOMContentLoaded', async () => {
    const city = getCityFromUrl();
    document.getElementById('city-name').textContent = city;
    if (!city) return;

    // Güncel hava durumu verisi çek
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},TR&appid=${API_KEY}&units=metric&lang=tr`;
    const res = await fetch(url);
    const data = await res.json();
    const infoDiv = document.getElementById('weather-info');
    if (data.main) {
        infoDiv.innerHTML = `
            <p><b>Sıcaklık:</b> ${data.main.temp} °C</p>
            <p><b>Nem:</b> ${data.main.humidity} %</p>
            <p><b>Rüzgar:</b> ${data.wind.speed} m/s</p>
        `;
        // Veriyi backend/data klasörüne kaydetmek için fetch ile backend'e POST atılabilir (eklenebilir)
    } else {
        infoDiv.textContent = 'Veri alınamadı.';
    }

    document.getElementById('show-analysis').addEventListener('click', () => {
        const method = document.getElementById('method-select').value;
        const dataType = document.getElementById('data-type-select') ? document.getElementById('data-type-select').value : 'temp';
        let chartData = {};
        if (window.analysisChartInstance) window.analysisChartInstance.destroy();
        if (method === 'temp') {
            // Sıcaklık, nem veya rüzgar değişimi
            let label, color, values;
            if (dataType === 'temp') {
                label = 'Sıcaklık (°C)';
                color = 'orange';
                values = [data.main.temp-2, data.main.temp-1, data.main.temp, data.main.temp+1, data.main.temp+2];
            } else if (dataType === 'humidity') {
                label = 'Nem (%)';
                color = 'aqua';
                values = [data.main.humidity-10, data.main.humidity-5, data.main.humidity, data.main.humidity+5, data.main.humidity+10];
            } else if (dataType === 'wind') {
                label = 'Rüzgar (m/s)';
                color = 'yellow';
                values = [data.wind.speed-2, data.wind.speed-1, data.wind.speed, data.wind.speed+1, data.wind.speed+2];
            }
            chartData = {
                labels: ['-2g', '-1g', 'Bugün', '+1g', '+2g'],
                datasets: [{
                    label: label,
                    data: values,
                    borderColor: color,
                    backgroundColor: color === 'orange' ? 'rgba(255,140,0,0.2)' : color === 'aqua' ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,0,0.2)',
                    fill: true
                }]
            };
        } else if (method === 'error') {
            const errors = [0, 1e-16, 2e-16, 4e-16, 8e-16, 1.6e-15, 3.2e-15, 6.4e-15, 1.28e-14, 2.56e-14, 5.12e-14];
            chartData = {
                labels: errors.map((_, i) => i),
                datasets: [{
                    label: 'Hata',
                    data: errors,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.2)',
                    fill: true
                }]
            };
        } else if (method === 'root') {
            const x = [1, 1.25, 1.5, 1.75, 2];
            const y = x.map(xi => Math.pow(xi,3) - xi - 2);
            chartData = {
                labels: x.map(xi => xi.toFixed(2)),
                datasets: [{
                    label: 'f(x) = x^3 - x - 2',
                    data: y,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0,0,255,0.2)',
                    fill: true
                }]
            };
        } else if (method === 'interp') {
            const x = [0, 1, 2, 3, 4, 5];
            const y = [15, 17, 20, 22, 21, 19];
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
                    {label: 'Lineer', data: lin, borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.2)', fill: false},
                    {label: 'Veri', data: xnew.map((xi,i) => x.includes(xi) ? y[x.indexOf(xi)] : null), borderColor: 'black', backgroundColor: 'black', fill: false, pointRadius: 4, showLine: false}
                ]
            };
        } else if (method === 'diff') {
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
            const x = Array.from({length: 11}, (_, i) => i);
            const y = x.map(xi => Math.sin(xi));
            let area = 0;
            for (let i = 0; i < x.length-1; i++) area += (y[i]+y[i+1])/2;
            chartData = {
                labels: x,
                datasets: [
                    {label: 'f(x)', data: y, borderColor: 'orange', backgroundColor: 'rgba(255,140,0,0.2)', fill: true}
                ]
            };
        }
        const ctx = document.getElementById('analysis-chart').getContext('2d');
        document.getElementById('analysis-chart').style.display = 'block';
        window.analysisChartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } }
                },
                scales: {
                    x: { ticks: { color: 'white' } },
                    y: { ticks: { color: 'white' } }
                }
            }
        });
    });

    document.getElementById('show-graph').addEventListener('click', () => {
        showBackBtn();
        const method = document.getElementById('method-select').value;
        const dataType = document.getElementById('data-type-select') ? document.getElementById('data-type-select').value : 'temp';
        let chartData = {};
        if (window.chartInstance) window.chartInstance.destroy();
        if (method === 'temp') {
            // Sıcaklık, nem veya rüzgar değişimi
            let label, color, values;
            if (dataType === 'temp') {
                label = 'Sıcaklık (°C)';
                color = 'orange';
                values = [data.main.temp-2, data.main.temp-1, data.main.temp, data.main.temp+1, data.main.temp+2];
            } else if (dataType === 'humidity') {
                label = 'Nem (%)';
                color = 'aqua';
                values = [data.main.humidity-10, data.main.humidity-5, data.main.humidity, data.main.humidity+5, data.main.humidity+10];
            } else if (dataType === 'wind') {
                label = 'Rüzgar (m/s)';
                color = 'yellow';
                values = [data.wind.speed-2, data.wind.speed-1, data.wind.speed, data.wind.speed+1, data.wind.speed+2];
            }
            chartData = {
                labels: ['-2g', '-1g', 'Bugün', '+1g', '+2g'],
                datasets: [{
                    label: label,
                    data: values,
                    borderColor: color,
                    backgroundColor: color === 'orange' ? 'rgba(255,140,0,0.2)' : color === 'aqua' ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,0,0.2)',
                    fill: true
                }]
            };
        } else if (method === 'error') {
            const errors = [0, 1e-16, 2e-16, 4e-16, 8e-16, 1.6e-15, 3.2e-15, 6.4e-15, 1.28e-14, 2.56e-14, 5.12e-14];
            chartData = {
                labels: errors.map((_, i) => i),
                datasets: [{
                    label: 'Hata',
                    data: errors,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.2)',
                    fill: true
                }]
            };
        } else if (method === 'root') {
            const x = [1, 1.25, 1.5, 1.75, 2];
            const y = x.map(xi => Math.pow(xi,3) - xi - 2);
            chartData = {
                labels: x.map(xi => xi.toFixed(2)),
                datasets: [{
                    label: 'f(x) = x^3 - x - 2',
                    data: y,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0,0,255,0.2)',
                    fill: true
                }]
            };
        } else if (method === 'interp') {
            const x = [0, 1, 2, 3, 4, 5];
            const y = [15, 17, 20, 22, 21, 19];
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
                    {label: 'Lineer', data: lin, borderColor: 'green', backgroundColor: 'rgba(0,255,0,0.2)', fill: false},
                    {label: 'Veri', data: xnew.map((xi,i) => x.includes(xi) ? y[x.indexOf(xi)] : null), borderColor: 'black', backgroundColor: 'black', fill: false, pointRadius: 4, showLine: false}
                ]
            };
        } else if (method === 'diff') {
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
            const x = Array.from({length: 11}, (_, i) => i);
            const y = x.map(xi => Math.sin(xi));
            let area = 0;
            for (let i = 0; i < x.length-1; i++) area += (y[i]+y[i+1])/2;
            chartData = {
                labels: x,
                datasets: [
                    {label: 'f(x)', data: y, borderColor: 'orange', backgroundColor: 'rgba(255,140,0,0.2)', fill: true}
                ]
            };
        }
        const ctx = document.getElementById('temp-chart').getContext('2d');
        document.getElementById('temp-chart').style.display = 'block';
        window.chartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: 'white' } }
                },
                scales: {
                    x: { ticks: { color: 'white' } },
                    y: { ticks: { color: 'white' } }
                }
            }
        });
    });
});
