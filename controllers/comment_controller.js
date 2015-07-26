var models = require('../models/models.js');

//GET /quizes/:id/comments/new
exports.new = function(req, res) {
	res.render('comments/new', {quizid: req.params.quizId, errors: []});
};

//POST /quizes/:id/comments
exports.create = function(req, res) {
	var comment = models.Comment.build(
		{	texto: 	req.body.comment.texto,
			QuizId: req.params.quizId
		});
	comment
		.validate()
		.then(
			function(err){
				if(err){
					res.render('comments/new',
						{comment: comment, quizid: req.params.quizId, errors: err.errors});
				} else {
					comment
						.save() // save: guarda en DB campo texto de comment
						.then(
							function(){
								res.redirect('/quizes/'+req.params.quizId);
							});
				}
			})
		.catch(function(error){next(error);});
};