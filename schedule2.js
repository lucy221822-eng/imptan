// JS файл для страницы расписания v2
document.addEventListener('DOMContentLoaded', () => {
    const PUBLISHED_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTljMMQKl_W3d4Re7mgCj8pae94ta7t_tk6YZda4cyusGzDn9FYaVud4Hgci7gObuB67lR3HeqyIni8/pub?gid=1299308055&single=true&output=csv';

    const scheduleBody = document.getElementById('scheduleBody');
    const loadingOverlay = document.getElementById('loadingOverlay');

    async function fetchSchedule() {
        // 1. Мгновенно загружаем из кэша
        const cachedCSV = localStorage.getItem('schedule_csv_cache');
        if (cachedCSV) {
            const data = parseCSV(cachedCSV);
            renderSchedule(data);
            loadingOverlay.classList.add('hidden');
            console.log('MSR: Loaded from cache');
        } else {
            loadingOverlay.classList.remove('hidden');
        }

        // 2. Фоновое обновление данных
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const targetUrl = encodeURIComponent(PUBLISHED_CSV_URL);
        
        try {
            const response = await fetch(PUBLISHED_CSV_URL);
            if (!response.ok) throw new Error('Direct fetch failed');
            const csvText = await response.text();
            
            if (csvText.includes('<!doctype html>')) throw new Error('HTML received');

            // Сохраняем в кэш и рендерим, если данные изменились
            if (csvText !== cachedCSV) {
                localStorage.setItem('schedule_csv_cache', csvText);
                const data = parseCSV(csvText);
                renderSchedule(data);
            }
            loadingOverlay.classList.add('hidden');
        } catch (error) {
            console.warn('Direct fetch failed, trying proxy...');
            try {
                const response = await fetch(`${proxyUrl}${targetUrl}`);
                const csvText = await response.text();
                if (csvText !== cachedCSV) {
                    localStorage.setItem('schedule_csv_cache', csvText);
                    const data = parseCSV(csvText);
                    renderSchedule(data);
                }
                loadingOverlay.classList.add('hidden');
            } catch (proxyError) {
                console.error('All fetch attempts failed');
                if (!cachedCSV) {
                    scheduleBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-red-400">Ошибка загрузки</td></tr>`;
                }
            }
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
        
        // Предварительная обработка данных для уменьшения нагрузки на основной поток
        for (let i = 0, len = data.length; i < len; i++) {
            const row = data[i];
            const timeMatch = row[0] && row[0].match(/^(\d{1,2}:\d{2})$/);
            
            if (timeMatch) {
                const time = timeMatch[1];
                const slot = { time: time, days: [] };
                const nextRow = data[i + 1] || [];
                const isDoubleTimeRow = nextRow[0] === time;
                const dataStartOffset = isDoubleTimeRow ? 2 : 1;
                const dayIndices = [2, 8, 14, 20, 26, 32];
                
                dayIndices.forEach((idx, dayIdx) => {
                    const items = [];
                    for (let step = 0; step < 6; step += 2) {
                        const classRow = data[i + dataStartOffset + step] || [];
                        const detailRow = data[i + dataStartOffset + step + 1] || [];
                        let id = (classRow[idx] || '').trim();
                        let title = (classRow[idx + 1] || '').trim();
                        let teacher = (detailRow[idx + 1] || '').trim();
                        let hall = (detailRow[idx + 3] || detailRow[idx + 2] || '').trim();

                        let statusText = '';
                        // Проверяем несколько ячеек вправо от названия группы (idx+2...idx+11)
                        // По скриншоту "набор" в ячейке L, R, X и т.д.
                        const potentialStatusIndices = [idx + 9, idx + 10, idx + 11, idx + 2, idx + 3];
                        
                        for (const k of potentialStatusIndices) {
                            const val = (data[i + dataStartOffset + step][k] || '').trim();
                            if (val && !val.match(/^[A-Zа-я]?-\d+$/i) && val !== id && val !== title && val.length < 25) {
                                statusText = val;
                                if (statusText.match(/^\d+$/)) statusText += ' мест';
                                break;
                            }
                        }
                        
                        // Поиск длительности
                        let duration = '';
                        for (let k = idx; k < idx + 6; k++) {
                            const val = (detailRow[k] || '').trim().toLowerCase();
                            if (val.match(/\d([.,]\d)?\s*ч/)) duration = val;
                        }

                        if (!id && !title && !teacher) continue;
                        if (classRow[0] && classRow[0].match(/^\d{1,2}:\d{2}$/) && step > 0) break;

                        if (id && id.length > 15 && !title) { title = id; id = ''; }
                        if (id && id.match(/[А-Яа-яA-Za-z]/) && !id.match(/[CUcu]-\d+/)) { if (!title) title = id; id = ''; }

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
                i += (isDoubleTimeRow ? 6 : 4); 
            }
        }

        timeSlots.forEach(slot => {
            const tr = document.createElement('tr');
            tr.className = 'divide-x divide-white/5';
            let html = `<td class="p-2 md:p-3 text-textSoft sticky left-0 bg-base z-20 border-r border-white/10 font-bold">${slot.time}</td>`;
            
            slot.days.forEach(day => {
                if (day.isEmpty) {
                    html += `<td class="p-2 md:p-3 text-center text-[10px] text-white/5 italic font-light uppercase tracking-wider">Аренда</td>`;
                } else {
                    html += `<td class="p-2 md:p-3 align-top"><div class="flex flex-col gap-2 min-w-[150px]">`;
                    
                    day.items.forEach(item => {
                        const bgStyle = getBgStyle(item.id || item.title);
                        // Создаем вертикальную плашку у правого края
                        let statusBadge = '';
                        if (item.status) {
                            statusBadge = `
                                <div class="absolute top-0 right-0 bottom-0 w-[18px] bg-gradient-to-b from-fuchsia-600 to-purple-600 flex items-center justify-center z-10 border-l border-white/10 shadow-sm">
                                    <span class="text-white text-[8px] font-black uppercase tracking-widest whitespace-nowrap" style="writing-mode: vertical-rl; -webkit-writing-mode: vertical-rl; transform: rotate(180deg); display: block;">
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
