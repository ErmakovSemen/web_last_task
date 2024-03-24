const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const myApp = express();

// Подключаемся к MongoDB используя Mongoose
mongoose.connect('mongodb://localhost:27017/contact_form', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Создаем схему и модель данных для формы обратной связи
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  interests: [String],
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Настройка сервера для парсинга данных
myApp.use(bodyParser.json());
myApp.use(bodyParser.urlencoded({ extended: true }));

// Роут для обработки POST запроса от формы обратной связи
myApp.post('/submit_form.php', (req, res) => {
  const newContact = new Contact({
    name: req.body.name,
    email: req.body.email,
    interests: req.body.interests,  // убедитесь, что <select multiple> присылает данные как массив
    message: req.body.message,
  });

  newContact.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сохранения информации.');
    } else {
      // После сохранения информации, отправляем пользователя обратно на страницу обратной связи
      res.redirect('/concat.html?status=success'); 
    }
  });
});

// Обрабатываем статические файлы (HTML, CSS, JS)
myApp.use(express.static('public'));

const PORT = process.env.PORT || 3000;
myApp.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});