document.addEventListener('DOMContentLoaded', () => {
    const names = [
        'Facu',
        'Lichi','Gus','Juli','Ale','AmigaTone','Dani','Guillo','Noe','Romi',
        'Sofi','Tami','Alvaro','Ana','Elea','Flor','Gabo','Jero','Mosca',
        'Niño','Pablito','Peter','Plu','Roa','Fran','Laura','Lucas','Magali',
        'Mono','Nico','Tone',
        'Eze','Gerson','Meli','Santi','Bian','Eka','Valen',
        // Add more names here, total 40 names
    ];

    const hatTableBody = document.querySelector('#hatTable tbody');
    const addNameButton = document.getElementById('addName');
    const newNameInput = document.getElementById('newName');
    const showWinnersButton = document.getElementById('showWinners');
    const toggleVisibilityButton = document.getElementById('toggleVisibility');
    const toggleCountersButton = document.getElementById('toggleCounters');
    const resetVotesButton = document.getElementById('resetVotes');
    const winnersDiv = document.getElementById('winners');

    function createRow(name) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>
                <button class="increment" data-category="mejor" data-name="${name}">+</button>
                <span class="points" data-category="mejor" data-name="${name}">0</span>
                <button class="decrement" data-category="mejor" data-name="${name}">-</button>
            </td>
            <td>
                <button class="increment" data-category="formal" data-name="${name}">+</button>
                <span class="points" data-category="formal" data-name="${name}">0</span>
                <button class="decrement" data-category="formal" data-name="${name}">-</button>
            </td>
            <td>
                <button class="increment" data-category="lo-que-pudo" data-name="${name}">+</button>
                <span class="points" data-category="lo-que-pudo" data-name="${name}">0</span>
                <button class="decrement" data-category="lo-que-pudo" data-name="${name}">-</button>
            </td>
            <td>
                <button class="remove" data-name="${name}">Remover</button>
            </td>
        `;
        hatTableBody.appendChild(row);
    }

    function addRow(name) {
        createRow(name);
        attachButtonHandlers();
    }

    function removeRow(name) {
        const row = document.querySelector(`button[data-name="${name}"]`).closest('tr');
        hatTableBody.removeChild(row);
        removePoints(name);
    }

    function savePoints() {
        const points = {};
        document.querySelectorAll('.points').forEach(span => {
            const category = span.getAttribute('data-category');
            const name = span.getAttribute('data-name');
            if (!points[name]) points[name] = {};
            points[name][category] = parseInt(span.textContent, 10);
        });
        localStorage.setItem('hatContestPoints', JSON.stringify(points));
    }

    function loadPoints() {
        const points = JSON.parse(localStorage.getItem('hatContestPoints') || '{}');
        for (const name in points) {
            for (const category in points[name]) {
                const pointsSpan = document.querySelector(`.points[data-category="${category}"][data-name="${name}"]`);
                if (pointsSpan) pointsSpan.textContent = points[name][category];
            }
        }
    }

    function removePoints(name) {
        const points = JSON.parse(localStorage.getItem('hatContestPoints') || '{}');
        delete points[name];
        localStorage.setItem('hatContestPoints', JSON.stringify(points));
    }

    function resetAllPoints() {
        localStorage.removeItem('hatContestPoints');
        document.querySelectorAll('.points').forEach(span => {
            span.textContent = '0';
        });
    }

    function attachButtonHandlers() {
        const incrementButtons = document.querySelectorAll('.increment');
        const decrementButtons = document.querySelectorAll('.decrement');
        const removeButtons = document.querySelectorAll('.remove');

        incrementButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                const name = button.getAttribute('data-name');
                const pointsSpan = document.querySelector(`.points[data-category="${category}"][data-name="${name}"]`);
                let points = parseInt(pointsSpan.textContent, 10);
                points += 1;
                pointsSpan.textContent = points;

                button.classList.add('pressed');
                setTimeout(() => {
                    button.classList.remove('pressed');
                }, 200);

                savePoints();
            });
        });

        decrementButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                const name = button.getAttribute('data-name');
                const pointsSpan = document.querySelector(`.points[data-category="${category}"][data-name="${name}"]`);
                let points = parseInt(pointsSpan.textContent, 10);
                if (points > 0) {
                    points -= 1;
                    pointsSpan.textContent = points;
                }

                button.classList.add('pressed');
                setTimeout(() => {
                    button.classList.remove('pressed');
                }, 200);

                savePoints();
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                removeRow(name);
            });
        });
    }

    names.forEach(name => createRow(name));
    loadPoints();
    attachButtonHandlers();

    addNameButton.addEventListener('click', () => {
        const newName = newNameInput.value.trim();
        if (newName && !names.includes(newName)) {
            names.push(newName);
            addRow(newName);
            newNameInput.value = '';
            savePoints();
        }
    });

    showWinnersButton.addEventListener('click', () => {
        const categories = ['mejor', 'formal', 'lo-que-pudo'];
        winnersDiv.innerHTML = '';
        categories.forEach(category => {
            let maxPoints = -1;
            let winner = '';
            const pointsSpans = document.querySelectorAll(`.points[data-category="${category}"]`);
            pointsSpans.forEach(span => {
                const points = parseInt(span.textContent, 10);
                const name = span.getAttribute('data-name');
                if (points > maxPoints) {
                    maxPoints = points;
                    winner = name;
                }
            });
            const winnerElement = document.createElement('h2');
            winnerElement.textContent = `Ganador ${category.charAt(0).toUpperCase() + category.slice(1)}: ${winner}`;
            winnersDiv.appendChild(winnerElement);
        });

        showWinnersButton.classList.add('pressed');
        setTimeout(() => {
            showWinnersButton.classList.remove('pressed');
        }, 200);
    });

    toggleVisibilityButton.addEventListener('click', () => {
        if (winnersDiv.style.display === 'none' || winnersDiv.style.display === '') {
            winnersDiv.style.display = 'block';
        } else {
            winnersDiv.style.display = 'none';
        }

        toggleVisibilityButton.classList.add('pressed');
        setTimeout(() => {
            toggleVisibilityButton.classList.remove('pressed');
        }, 200);
    });

    toggleCountersButton.addEventListener('click', () => {
        const pointsSpans = document.querySelectorAll('.points');
        pointsSpans.forEach(span => {
            if (span.style.display === 'none' || span.style.display === '') {
                span.style.display = 'inline';
            } else {
                span.style.display = 'none';
            }
        });

        toggleCountersButton.classList.add('pressed');
        setTimeout(() => {
            toggleCountersButton.classList.remove('pressed');
        }, 200);
    });

    resetVotesButton.addEventListener('click', () => {
        resetAllPoints();

        resetVotesButton.classList.add('pressed');
        setTimeout(() => {
            resetVotesButton.classList.remove('pressed');
        }, 200);
    });
});
