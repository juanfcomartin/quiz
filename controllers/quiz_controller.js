var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId)
		.then(function(quiz){
			if(quiz){
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId='+quizId));
			}
		})
		.catch(function(error){ 
			next(error);
		});
}

//GET /quizes
exports.index = function(req, res){
	if(req.query.search){
		//Busqueda
		var consulta = req.query.search.replace(/\s/g,'%').replace(/(.*)/,'%$1%').toLowerCase();
		models.Quiz.findAll({where:["lower(pregunta) LIKE ?", consulta]})
		.then(function(quizes){
			console.log('Quizes '+quizes);
			res.render('quizes/index.ejs', {quizes: quizes});
		});
	}else{
		//Formulario
		res.render('quizes/index.ejs', {quizes: null});
	}
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};
// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});		
};
