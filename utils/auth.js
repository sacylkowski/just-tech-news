// authguard the dashboard to logged in users.  And redirects them to the login page

const withAuth = (req, res, next) => {
    // if there is no existance of a session property
    if (!req.session.user_id) {
        // then redirect to the login page
        res.redirect("/login");
    } else {
        next();
    }
};

module.exports = withAuth;