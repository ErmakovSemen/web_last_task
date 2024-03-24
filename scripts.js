window.onload = function () {
    let textForm = document.getElementById('textForm');
    let textInput = document.getElementById('textInput');
    let recordButton = document.getElementById('recordButton');
    let audioPlayback = document.getElementById('audioPlayback');

    let mediaRecorder;
    let audioChunks = [];

    textForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let userMessage = textInput.value.trim();
        let response = "Я вас не понимаю.";

        // Регулярные выражения и ответы
        const patterns = [
            {pattern: /привет/i, response: "Привет!"},
            {pattern: /как дела/i, response: "Хорошо, спасибо, что спросили!"},
            {pattern: /пока/i, response: "До встречи!"}
            // Другие автоответы...
        ];

        patterns.some(patternItem => {
            if (patternItem.pattern.test(userMessage)) {
                response = patternItem.response;
                return true; // Прерываем цикл, если нашли соответствие
            }
        });

        alert(response); // Временное решение для вывода ответа
        textInput.value = ''; // очищаем текстовое поле ввода
    });

    recordButton.addEventListener('click', function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = function(e) {
                    audioChunks.push(e.data);
                };
                mediaRecorder.onstop = playbackRecording;
                mediaRecorder.start();
                recordButton.textContent = 'Остановить запись';
            }).catch(function(err) {
                console.error('Не удалось начать запись аудио: ', err);
            });
        }
    });

    function playbackRecording() {
        const audioBlob = new Blob(audioChunks, { 'type': 'audio/mpeg' });
        const audioURL = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioURL;
        audioPlayback.hidden = false;
        recordButton.textContent = 'Записать аудиосообщение';
        audioChunks = [];
    }
};
