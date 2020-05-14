'use strict';

module.exports = function () {
      return {
            loginCheck: (req, res, next) => {
                  //  next();
                  if (req.session.email) 
                  {
                        next();
                  } else {
                        req.session.error = 'Access denied!';
                        res.redirect('/login');
                  }
            }
      }
}
