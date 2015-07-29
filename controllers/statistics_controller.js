var models = require('../models/models.js');

//GET /quizes/statistics
exports.index = function(req, res, next){	
	models.Quiz.findAll({include: [{model: models.Comment}]})
		.then(function(quizes){
			var i,j, n_preg, n_comm=0, avg_comm=0, n_preg_nocomm=0, n_preg_comm=0;
			n_preg = quizes.length;
			for (i in quizes){
				n_comm += quizes[i].Comments.length;
				if(quizes[i].Comments.length > 0) {
					n_preg_comm ++;
				} else { n_preg_nocomm ++;}
			}
			if(n_preg > 0) {avg_comm = n_comm / n_preg;}
			res.render('statistics/index.ejs', {n_preg: n_preg, n_comm: n_comm, avg_comm: avg_comm,
												 n_preg_nocomm: n_preg_nocomm, n_preg_comm: n_preg_comm,
												 errors: []});
		})
		.catch(function(error){next(error);});
};