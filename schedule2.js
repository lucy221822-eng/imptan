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
        
        // Находим строки с временем
        const timeSlots = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const timeMatch = row[0] && row[0].match(/^(\d{1,2}:\d{2})$/);
            
            if (timeMatch) {
                const time = timeMatch[1];
                const classRow = data[i + 1] || [];
                const detailRow = data[i + 2] || [];
                
                const slot = {
                    time: time,
                    days: [] // Пн, Вт, Ср, Чт, Пт, Сб
                };

                // Индексы колонок для дней (каждые 6 колонок, начиная со 2-й)
                const dayIndices = [2, 8, 14, 20, 26, 32];
                
                dayIndices.forEach(idx => {
                    const id = classRow[idx] || '';
                    const title = classRow[idx + 1] || '';
                    const teacher = detailRow[idx + 1] || '';
                    const hall = detailRow[idx + 3] || detailRow[idx + 2] || ''; // В разных строках может быть по-разному
                    
                    if (title || teacher) {
                        slot.days.push({
                            id,
                            title,
                            teacher,
                            hall,
                            isEmpty: false
                        });
                    } else {
                        // Проверяем, нет ли там текста "Аренда залов" или пустоты
                        const isRent = title.toLowerCase().includes('аренда') || teacher.toLowerCase().includes('аренда');
                        slot.days.push({
                            isEmpty: true,
                            isRent: isRent || (!title && !teacher)
                        });
                    }
                });
                
                timeSlots.push(slot);
                i += 2; // Пропускаем обработанные строки данных
            }
        }

        timeSlots.forEach(slot => {
            const tr = document.createElement('tr');
            
            // Колонка времени
            let html = `<td class="p-2 md:p-3 text-textSoft sticky left-0 bg-base z-20 border-r border-white/10 font-medium">${slot.time}</td>`;
            
            // Колонки дней
            slot.days.forEach(day => {
                if (day.isEmpty) {
                    html += `<td class="p-2 md:p-3 text-center text-xs text-white/20 italic">Аренда залов</td>`;
                } else {
                    const bgColor = getBgColor(day.id || day.title);
                    html += `
                        <td class="p-2 md:p-3 align-top">
                            <div class="space-y-1 min-w-[140px]">
                                <span class="block rounded-lg ${bgColor} px-2 py-1 text-white font-medium">
                                    ${day.id ? day.id + ' • ' : ''}${day.title}
                                </span>
                                <p class="text-[10px] md:text-xs text-textSoft leading-tight">
                                    ${day.teacher}${day.hall ? ' • ' + day.hall : ''}
                                </p>
                                <span class="inline-block rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">Запись открыта</span>
                            </div>
                        </td>
                    `;
                }
            });
            
            tr.innerHTML = html;
            scheduleBody.appendChild(tr);
        });
    }

    function getBgColor(text) {
        const t = (text || '').toLowerCase();
        if (t.includes('pole dance')) return 'bg-indigo-500/40';
        if (t.includes('exotic')) return 'bg-violet-500/40';
        if (t.includes('стретчинг')) return 'bg-fuchsia-500/40';
        if (t.includes('стрип')) return 'bg-rose-500/40';
        if (t.includes('frame up')) return 'bg-pink-500/40';
        if (t.includes('art')) return 'bg-purple-500/40';
        if (t.includes('sport')) return 'bg-cyan-500/40';
        return 'bg-white/10';
    }

    fetchSchedule();
    
    // Обновление каждые 5 минут
    setInterval(fetchSchedule, 5 * 60 * 1000);
});
