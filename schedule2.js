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

                // Проверяем, не дублируется ли время в следующей строке (как в 18:30)
                const nextRow = data[i + 1] || [];
                const isDoubleTimeRow = nextRow[0] === time;
                const dataStartOffset = isDoubleTimeRow ? 2 : 1;

                // Индексы колонок: Пн(2), Вт(8), Ср(14), Чт(20), Пт(26), Сб(32)
                const dayIndices = [2, 8, 14, 20, 26, 32];
                
                dayIndices.forEach((idx, dayIdx) => {
                    const items = [];
                    
                    // Проверяем несколько пар строк под временем
                    for (let step = 0; step < 6; step += 2) {
                        const classRow = data[i + dataStartOffset + step] || [];
                        const detailRow = data[i + dataStartOffset + step + 1] || [];
                        
                        let id = (classRow[idx] || '').trim();
                        let title = (classRow[idx + 1] || '').trim();
                        let teacher = (detailRow[idx + 1] || '').trim();
                        let hall = (detailRow[idx + 3] || detailRow[idx + 2] || '').trim();

                        // Поиск статуса "набор" или свободных мест
                        let statusText = '';
                        
                        // По скриншоту:
                        // Понедельник начинается с индекса 2. "набор" в колонке L (индекс 11).
                        // Смещение: 11 - 2 = 9. Проверим ячейку idx + 9
                        const naborVal = (classRow[idx + 9] || '').trim();
                        if (naborVal.toLowerCase().includes('набор') || /\d/.test(naborVal)) {
                            statusText = naborVal;
                            if (naborVal.match(/^\d+$/)) statusText += ' мест';
                        }
                        
                        // Если в idx+9 пусто, на всякий случай проверим соседние (idx+2...idx+10)
                        if (!statusText) {
                            for (let k = idx + 2; k <= idx + 10; k++) {
                                const val = (classRow[k] || '').trim();
                                if (val && val.toLowerCase().includes('набор')) {
                                    statusText = val;
                                    break;
                                }
                            }
                        }

                        // Поиск длительности
                        let duration = '';
                        for (let k = idx; k < idx + 6; k++) {
                            const val = (detailRow[k] || '').trim().toLowerCase();
                            if (val.match(/\d([.,]\d)?\s*ч/)) duration = val;
                        }

                        // Если строка пустая или это начало следующего временного слота
                        if (!id && !title && !teacher) continue;
                        if (classRow[0] && classRow[0].match(/^\d{1,2}:\d{2}$/) && step > 0) break;

                        // Исправляем ситуацию, когда ID и название перепутаны или склеены
                        if (id && id.length > 15 && !title) {
                            title = id;
                            id = '';
                        }
                        
                        if (id && id.match(/[А-Яа-яA-Za-z]/) && !id.match(/[CUcu]-\d+/)) {
                            if (!title) title = id;
                            id = '';
                        }

                        if (title || teacher || id) {
                            items.push({ id, title, teacher, hall, duration, status: statusText });
                        }
                    }

                    if (items.length > 0) {
                        slot.days.push({ items, isEmpty: false });
                    } else {
                        slot.days.push({ isEmpty: true, isRent: true });
                    }
                });
                
                timeSlots.push(slot);
                // Пропускаем обработанный блок
                i += (isDoubleTimeRow ? 6 : 4); 
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
                        const bgStyle = getBgStyle(item.id || item.title);
                        
                        // Создаем вертикальную плашку у правого края
                        let statusBadge = '';
                        if (item.status) {
                            statusBadge = `
                                <div class="absolute top-0 right-0 bottom-0 w-[18px] bg-gradient-to-b from-fuchsia-600 to-purple-600 flex items-center justify-center z-10 border-l border-white/10 shadow-sm">
                                    <span class="text-white text-[8px] font-black uppercase tracking-widest whitespace-nowrap" style="writing-mode: vertical-rl; transform: rotate(180deg);">
                                        ${item.status}
                                    </span>
                                </div>
                            `;
                        }

                        html += `
                            <div class="relative overflow-hidden rounded-lg p-2 shadow-lg border hover:border-white/50 transition-colors" style="${bgStyle}">
                                ${statusBadge}
                                <div class="mb-1 pr-5">
                                    <span class="text-[11px] font-black text-white leading-tight uppercase tracking-tight block">
                                        ${item.id ? item.id + ' • ' : ''}${item.title}
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/90 font-bold leading-tight pr-5">
                                    <span class="opacity-100">${item.teacher}</span>
                                    ${item.hall ? `<span class="text-[9px] opacity-70 px-1 border border-white/20 rounded uppercase">${item.hall}</span>` : ''}
                                    ${item.duration ? `<span class="text-[9px] opacity-70 uppercase">${item.duration}</span>` : ''}
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

    function getBgStyle(text) {
        const t = (text || '').trim().toLowerCase();
        
        // Извлекаем номер группы (число от 100 до 399)
        const groupMatch = t.match(/\d+/);
        const groupNumber = groupMatch ? parseInt(groupMatch[0]) : 0;
        
        let hue = 0;
        
        // Новая схема распределения цветов по сериям групп (сдвиг +120 градусов):
        // 100-я серия (111-129): Розово-пурпурная гамма (была синяя)
        // 200-я серия (211-229): Бирюзово-зеленая гамма (была розовая)
        // 300-я серия (311-329): Оранжево-желтая гамма (была бирюзовая)
        
        if (groupNumber >= 100 && groupNumber < 200) {
            // Было 220 -> стало 340 (Розовый)
            hue = (220 + 120) % 360; 
            hue += ((groupNumber % 100) * 12); // Увеличен шаг с 5 до 12
        } else if (groupNumber >= 200 && groupNumber < 300) {
            // Было 280 -> стало 40 (Оранжевый)
            hue = (280 + 120) % 360;
            hue += ((groupNumber % 100) * 12); // Увеличен шаг с 5 до 12
        } else if (groupNumber >= 300 && groupNumber < 400) {
            // Было 150 -> стало 270 (Фиолетовый)
            hue = (150 + 120) % 360;
            hue += ((groupNumber % 100) * 12); // Увеличен шаг с 5 до 12
        } else {
            // Для остальных используем старую логику с золотым углом и смещением 120
            hue = (120 + groupNumber * 137.5) % 360;
        }
        
        const saturation = 70;
        const lightness = 60;
        
        // Возвращаем объект для использования в inline-стиле
        return `background-color: hsl(${hue}, ${saturation}%, ${lightness}%, 0.4); border-color: hsl(${hue}, ${saturation}%, ${lightness}%, 0.6);`;
    }

    fetchSchedule();
    
    // Обновление каждые 5 минут
    setInterval(fetchSchedule, 5 * 60 * 1000);
});
