// JS файл для страницы расписания v2
document.addEventListener('DOMContentLoaded', () => {
    const PUBLISHED_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTljMMQKl_W3d4Re7mgCj8pae94ta7t_tk6YZda4cyusGzDn9FYaVud4Hgci7gObuB67lR3HeqyIni8/pub?gid=1299308055&single=true&output=csv';

    const scheduleBody = document.getElementById('scheduleBody');
    const loadingOverlay = document.getElementById('loadingOverlay');

    async function fetchSchedule() {
        loadingOverlay.classList.remove('hidden');
        
        // Используем CORS-прокси для обхода ограничений, если файл открыт локально (через file://)
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent(PUBLISHED_CSV_URL);
        
        const urls = [
            PUBLISHED_CSV_URL, // Сначала пробуем напрямую
            `${proxyUrl}${targetUrl}` // Если не вышло, через прокси
        ];

        let lastError = null;

        for (const url of urls) {
            try {
                console.log('Fetching from:', url);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const csvText = await response.text();
                
                if (csvText.includes('<!doctype html>')) {
                    throw new Error('Получен HTML вместо CSV.');
                }

                const data = parseCSV(csvText);
                if (data.length < 2) throw new Error('Получена пустая таблица');

                renderSchedule(data);
                loadingOverlay.classList.add('hidden');
                console.log('Successfully loaded schedule');
                return;
            } catch (error) {
                console.error(`Failed to fetch from ${url}:`, error);
                lastError = error;
            }
        }

        scheduleBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center">
            <div class="text-red-400 font-bold mb-2">Не удалось загрузить данные</div>
            <div class="text-sm text-textSoft mb-4">Ошибка: ${lastError.message}</div>
            <div class="text-xs text-textSoft mb-4 italic">
                Если вы открыли файл просто двойным кликом, браузер может блокировать загрузку. <br>
                Попробуйте открыть через локальный сервер или загрузить на хостинг.
            </div>
            <button onclick="location.reload()" class="bg-neon/20 hover:bg-neon/40 border border-neon/50 px-4 py-2 rounded-lg text-xs transition-colors">
                Обновить страницу
            </button>
        </td></tr>`;
        loadingOverlay.classList.add('hidden');
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
        scheduleBody.innerHTML = '';
        
        const timeSlots = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const timeMatch = row[0] && row[0].match(/^(\d{1,2}:\d{2})$/);
            
            if (timeMatch) {
                const time = timeMatch[1];
                const slot = { time: time, days: [] };

                // Индексы колонок: Пн(2), Вт(8), Ср(14), Чт(20), Пт(26), Сб(32)
                const dayIndices = [2, 8, 14, 20, 26, 32];
                
                dayIndices.forEach(idx => {
                    const items = [];
                    
                    // Проверяем 4 строки под временем для поиска групп (по 2 строки на группу)
                    for (let step = 1; step <= 3; step += 2) {
                        const classRow = data[i + step] || [];
                        const detailRow = data[i + step + 1] || [];
                        
                        const id = (classRow[idx] || '').trim();
                        const title = (classRow[idx + 1] || '').trim();
                        const teacher = (detailRow[idx + 1] || '').trim();
                        const hall = (detailRow[idx + 3] || detailRow[idx + 2] || '').trim();
                        
                        // Поиск длительности и статуса "набор" в строке деталей
                        let duration = '';
                        let isNabor = false;
                        
                        for (let k = idx; k < idx + 6; k++) {
                            const val = (detailRow[k] || '').trim().toLowerCase();
                            if (val.match(/\d([.,]\d)?\s*ч/)) duration = val;
                            if (val.includes('набор')) isNabor = true;
                        }
                        
                        // Дополнительная проверка набора в названии или преподавателе
                        if ((title + teacher).toLowerCase().includes('набор')) isNabor = true;

                        if (title || teacher || id) {
                            items.push({ id, title, teacher, hall, duration, isNabors: isNabor });
                        }
                    }

                    if (items.length > 0) {
                        slot.days.push({ items, isEmpty: false });
                    } else {
                        const isRent = true; // Если ничего не нашли, считаем арендой
                        slot.days.push({ isEmpty: true, isRent: isRent });
                    }
                });
                
                timeSlots.push(slot);
                i += 3; // Пропускаем блок строк одного временного слота
            }
        }

        timeSlots.forEach(slot => {
            const tr = document.createElement('tr');
            let html = `<td class="p-2 md:p-3 text-textSoft sticky left-0 bg-base z-20 border-r border-white/10 font-bold">${slot.time}</td>`;
            
            slot.days.forEach(day => {
                if (day.isEmpty) {
                    html += `<td class="p-2 md:p-3 text-center text-[10px] text-white/10 italic font-light uppercase tracking-wider">Аренда залов</td>`;
                } else {
                    html += `<td class="p-2 md:p-3 align-top"><div class="flex flex-col gap-2 min-w-[150px]">`;
                    
                    day.items.forEach(item => {
                        const bgColor = getBgColor(item.id || item.title);
                        html += `
                            <div class="relative overflow-hidden rounded-lg ${bgColor} p-2 shadow-lg border border-white/5">
                                <div class="flex items-start justify-between gap-1 mb-1">
                                    <span class="text-[11px] font-black text-white leading-tight uppercase tracking-tight">
                                        ${item.id ? item.id + ' • ' : ''}${item.title}
                                    </span>
                                    ${item.isNabors ? '<span class="shrink-0 bg-emerald-500 text-[8px] font-black px-1 py-0.5 rounded text-white uppercase tracking-tighter">набор</span>' : ''}
                                </div>
                                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/90 font-bold leading-tight">
                                    <span class="opacity-100">${item.teacher}</span>
                                    ${item.hall ? `<span class="text-[9px] opacity-70 px-1 border border-white/20 rounded">ЗАЛ ${item.hall.toUpperCase()}</span>` : ''}
                                    ${item.duration ? `<span class="text-[9px] opacity-70">${item.duration.toUpperCase()}</span>` : ''}
                                </div>
                            </div>
                        `;
                    });

                    html += `</div></td>`;
                }
            });
            
            tr.innerHTML = html;
            scheduleBody.appendChild(tr);
        });
    }

    function getBgColor(text) {
        const t = (text || '').trim().toLowerCase();
        
        // Извлекаем код группы (например, 'c-10' из '#c-10')
        const groupMatch = t.match(/[cu]-\d+/);
        const groupKey = groupMatch ? groupMatch[0] : t;
        
        let hash = 0;
        for (let i = 0; i < groupKey.length; i++) {
            hash = groupKey.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Яркие и насыщенные цвета для лучшей видимости
        const colors = [
            'bg-indigo-600',
            'bg-violet-600',
            'bg-fuchsia-600',
            'bg-rose-600',
            'bg-pink-600',
            'bg-purple-600',
            'bg-cyan-600',
            'bg-blue-600',
            'bg-emerald-600',
            'bg-amber-600'
        ];
        
        return colors[Math.abs(hash) % colors.length];
    }

    fetchSchedule();
    
    // Обновление каждые 5 минут
    setInterval(fetchSchedule, 5 * 60 * 1000);
});
