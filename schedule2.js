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
                    const id = (classRow[idx] || '').trim();
                    const title = (classRow[idx + 1] || '').trim();
                    const teacher = (detailRow[idx + 1] || '').trim();
                    const hall = (detailRow[idx + 3] || detailRow[idx + 2] || '').trim();
                    const statusInfo = (detailRow[idx + 5] || '').trim().toLowerCase();
                    
                    // Проверка на наличие второй группы (обычно идет сразу следующей парой строк)
                    const classRow2 = data[i + 2] || [];
                    const detailRow2 = data[i + 3] || [];
                    const id2 = (classRow2[idx] || '').trim();
                    const title2 = (classRow2[idx + 1] || '').trim();
                    const teacher2 = (detailRow2[idx + 1] || '').trim();
                    const hall2 = (detailRow2[idx + 3] || detailRow2[idx + 2] || '').trim();
                    const statusInfo2 = (detailRow2[idx + 5] || '').trim().toLowerCase();

                    // Функция для извлечения длительности (1ч, 1.5ч и т.д.)
                    const extractDuration = (row, startIdx) => {
                        // Ищем в ближайших 10 ячейках строки слово с "ч" или "час"
                        for (let k = startIdx; k < startIdx + 10; k++) {
                            const val = (row[k] || '').toLowerCase();
                            if (val.match(/\d([.,]\d)?\s*ч/)) return val;
                        }
                        return '';
                    };

                    const duration1 = extractDuration(detailRow, idx);
                    const duration2 = extractDuration(detailRow2, idx);

                    if (title || teacher) {
                        const items = [];
                        
                        // Функция для строгой проверки набора
                        const checkIsNabor = (t, teach, stat) => {
                            const combined = `${t} ${teach} ${stat}`.toLowerCase();
                            return combined.includes('набор') && !combined.includes('аренда');
                        };

                        // Добавляем первую группу
                        items.push({
                            id,
                            title,
                            teacher,
                            hall,
                            duration: duration1,
                            isNabors: checkIsNabor(title, teacher, statusInfo)
                        });

                        // Если во второй строке есть данные и это не повтор первой группы
                        if ((title2 || teacher2) && (title2 !== title || id2 !== id)) {
                            items.push({
                                id: id2,
                                title: title2,
                                teacher: teacher2,
                                hall: hall2,
                                duration: duration2,
                                isNabors: checkIsNabor(title2, teacher2, statusInfo2)
                            });
                        }

                        slot.days.push({
                            items,
                            isEmpty: false
                        });
                    } else {
                        const combinedText = (title + teacher).toLowerCase();
                        const isRent = combinedText.includes('аренда') || (!title && !teacher);
                        slot.days.push({
                            isEmpty: true,
                            isRent: isRent
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
                    html += `<td class="p-2 md:p-3 align-top"><div class="flex flex-col gap-3 min-w-[140px]">`;
                    
                    day.items.forEach(item => {
                        const bgColor = getBgColor(item.id || item.title);
                        html += `
                            <div class="space-y-1">
                                <span class="block rounded-lg ${bgColor} px-2 py-1 text-white font-medium">
                                    ${item.id ? item.id + ' • ' : ''}${item.title}
                                </span>
                                <p class="text-[10px] md:text-xs text-textSoft leading-tight font-medium">
                                    ${item.teacher}${item.hall ? ' • ' + item.hall : ''}${item.duration ? ' • ' + item.duration : ''}
                                </p>
                                ${item.isNabors ? '<span class="inline-block rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">Запись открыта</span>' : ''}
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
