// JS файл для страницы расписания v2
document.addEventListener('DOMContentLoaded', () => {
    const PUBLISHED_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTljMMQKl_W3d4Re7mgCj8pae94ta7t_tk6YZda4cyusGzDn9FYaVud4Hgci7gObuB67lR3HeqyIni8/pub?gid=1299308055&single=true&output=csv';

    const scheduleBody = document.getElementById('scheduleBody');
    const loadingOverlay = document.getElementById('loadingOverlay');

    async function fetchSchedule() {
        // 1. Показываем загрузку только если нет кэша
        const cachedCSV = localStorage.getItem('schedule_csv_cache');
        if (cachedCSV) {
            try {
                const data = parseCSV(cachedCSV);
                if (data && data.length > 0) {
                    renderSchedule(data);
                    loadingOverlay.classList.add('hidden');
                }
            } catch (e) {
                console.error('Cache error:', e);
            }
        } else {
            loadingOverlay.classList.remove('hidden');
        }

        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent(PUBLISHED_CSV_URL);
        
        // Функция для загрузки данных
        const loadData = async (url) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const text = await response.text();
            if (text && !text.includes('<!doctype html>')) return text;
            throw new Error('Invalid data');
        };

        try {
            let csvText;
            try {
                // Пробуем напрямую
                csvText = await loadData(PUBLISHED_CSV_URL);
            } catch (e) {
                // Если не вышло, через прокси
                csvText = await loadData(`${proxyUrl}${targetUrl}`);
            }

            if (csvText) {
                localStorage.setItem('schedule_csv_cache', csvText);
                const data = parseCSV(csvText);
                renderSchedule(data);
            }
        } catch (error) {
            console.error('Fetch failed:', error);
            if (!cachedCSV) {
                scheduleBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-red-400">Ошибка загрузки. Проверьте соединение.</td></tr>`;
            }
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    }

    function parseCSV(text) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentCell.trim());
                currentCell = '';
            } else if (char === '\n' && !inQuotes) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
                currentRow = [];
                currentCell = '';
            } else if (char === '\r' && !inQuotes) {
                // Ignore
            } else {
                currentCell += char;
            }
        }
        if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
        }
        return rows;
    }

    function renderSchedule(data) {
        if (!data || data.length === 0) return;
        
        const fragment = document.createDocumentFragment();
        const timeSlots = [];
        
        // 1. Собираем данные
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const timeMatch = row[0] && row[0].trim().match(/^(\d{1,2}:\d{2})$/);
            
            if (timeMatch) {
                const time = timeMatch[1];
                const slot = { time: time, days: [] };
                
                const nextRow = data[i + 1] || [];
                const isDoubleTimeRow = nextRow[0] === time;
                const dataStartOffset = isDoubleTimeRow ? 2 : 1;
                const dayIndices = [2, 8, 14, 20, 26, 32];
                
                dayIndices.forEach((idx) => {
                    const items = [];
                    for (let step = 0; step < 6; step += 2) {
                        const rowIndex = i + dataStartOffset + step;
                        if (rowIndex >= data.length) break;
                        
                        const classRow = data[rowIndex] || [];
                        const detailRow = data[rowIndex + 1] || [];
                        
                        let id = (classRow[idx] || '').trim();
                        let title = (classRow[idx + 1] || '').trim();
                        let teacher = (detailRow[idx + 1] || '').trim();
                        let hall = (detailRow[idx + 3] || detailRow[idx + 2] || '').trim();

                        if (!id && !title && !teacher) continue;

                        // Поиск статуса
                        let statusText = '';
                        // Каждый день занимает 6 колонок. Статус — это ПОСЛЕДНЯЯ (6-я) колонка дня.
                        // Пн: B(1)-G(6), статус в G(6) -> idx + 4 (так как idx начинается с B=2 в коде)
                        // СТОП: В коде dayIndices = [2, 8, 14, 20, 26, 32] (это колонки C, I, O, U, AA, AG - где Название)
                        // Значит статус для Пн должен быть в G (индекс 6). Смещение от C(2) до G(6) = +4.
                        
                        const statusIdx = idx + 4; 
                        const val = (classRow[statusIdx] || '').trim();
                        
                        if (val && val.length > 0 && val.length < 15) {
                            // Исключаем любые намеки на ID групп (числа или формат X-00)
                            if (!val.match(/^\d+$/) && !val.match(/^[A-Zа-я]?-\d+$/i)) {
                                statusText = val;
                            }
                        }

                        let duration = '';
                        for (let k = idx; k < idx + 6; k++) {
                            const val = (detailRow[k] || '').trim().toLowerCase();
                            if (val.match(/\d([.,]\d)?\s*ч/)) duration = val;
                        }

                        items.push({ id, title, teacher, hall, duration, status: statusText });
                    }

                    slot.days.push({ items, isEmpty: items.length === 0 });
                });
                
                timeSlots.push(slot);
                i += (isDoubleTimeRow ? 6 : 4); 
            }
        }

        // 2. Отрисовываем
        timeSlots.forEach(slot => {
            const tr = document.createElement('tr');
            tr.className = 'divide-x divide-white/5 border-b border-white/5';
            
            let html = `<td class="p-2 md:p-3 text-textSoft sticky left-0 bg-base z-20 border-r border-white/10 font-bold">${slot.time}</td>`;
            
            slot.days.forEach(day => {
                if (day.isEmpty) {
                    html += `<td class="p-2 md:p-3 text-center text-[10px] text-white/5 italic font-light uppercase tracking-wider">Аренда</td>`;
                } else {
                    html += `<td class="p-2 md:p-3 align-top"><div class="flex flex-col gap-2 min-w-[150px]">`;
                    day.items.forEach(item => {
                        const bgStyle = getBgStyle(item.id || item.title);
                        let statusBadge = '';
                        if (item.status) {
                            statusBadge = `
                                <div class="absolute top-0 right-0 bottom-0 w-[18px] bg-gradient-to-b from-fuchsia-600 to-purple-600 flex items-center justify-center z-10 border-l border-white/10">
                                    <span class="text-white text-[8px] font-black uppercase tracking-widest whitespace-nowrap" style="writing-mode: vertical-rl; -webkit-writing-mode: vertical-rl; display: block; width: 100%; text-align: center;">
                                        ${item.status}
                                    </span>
                                </div>
                            `;
                        }

                        html += `
                            <div class="relative overflow-hidden rounded-lg p-2 shadow-lg border border-white/10 hover:border-white/30 transition-all" style="${bgStyle}">
                                ${statusBadge}
                                <div class="mb-1 pr-5">
                                    <span class="text-[11px] font-black text-white leading-tight uppercase tracking-tight block">
                                        ${item.id ? item.id + ' • ' : ''}${item.title}
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/80 font-bold leading-tight pr-5">
                                    <span>${item.teacher}</span>
                                    ${item.hall ? `<span class="text-[9px] opacity-60 px-1 border border-white/10 rounded uppercase">${item.hall}</span>` : ''}
                                    ${item.duration ? `<span class="text-[9px] opacity-60 uppercase">${item.duration}</span>` : ''}
                                </div>
                            </div>
                        `;
                    });
                    html += `</div></td>`;
                }
            });
            
            tr.innerHTML = html;
            fragment.appendChild(tr);
        });

        scheduleBody.innerHTML = '';
        scheduleBody.appendChild(fragment);
    }

    function getBgStyle(text) {
        const t = (text || '').trim().toLowerCase();
        
        // Извлекаем номер группы
        const groupMatch = t.match(/\d+/);
        const groupNumber = groupMatch ? parseInt(groupMatch[0]) : 0;
        
        // Используем логику золотого угла (137.5°) для всего спектра (360°)
        // Это гарантирует, что даже соседние номера (например, 111 и 112) 
        // будут иметь максимально контрастные цвета, распределенные по всему кругу.
        const goldenAngle = 137.5;
        const hue = (groupNumber * goldenAngle) % 360;
        
        const saturation = 70;
        const lightness = 60;
        
        // Возвращаем объект для использования в inline-стиле
        return `background-color: hsl(${hue}, ${saturation}%, ${lightness}%, 0.4); border-color: hsl(${hue}, ${saturation}%, ${lightness}%, 0.6);`;
    }

    fetchSchedule();
    
    // Обновление каждые 5 минут
    setInterval(fetchSchedule, 5 * 60 * 1000);
});
