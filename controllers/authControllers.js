const { pool } = require('../dbCon');
const bcrypt = require('bcrypt')

module.exports.register_get = (req, res) => {
    let errors = [];
    res.render("register", { errors });
}
module.exports.login_get = (req, res) => {
    res.render("login");
}
module.exports.register_post = (req, res) => {
    let {name, email, password, password2} = req.body;

    let errors = [];
    if(!name || !email || !password || !password2) {
        errors.push({ message: "All Fields are required"});
    }
    if (password.length < 6) {
        errors.push({ message: "Password must be atleast 6 charcters"});
    }
    if (password !== password2) {
        errors.push({ message: "Passwords does not match!" });
    }

    if(errors.length > 0) {
        // console.log(errors)
        res.render("register", { errors })
    } else {
        // check if the email exist in DB
        pool.query(
            `SELECT * FROM users WHERE email = $1` ,[email] , async (err, result) => {
                if(err) {
                    throw err;
                    // errors.push({ message: "something went wrong please try again"});
                    // res.render("register", { errors })
                } else if(result.rows.length > 0) {
                    errors.push({ message: "this Email already registered"});
                    res.render("register", { errors })
                } else {
                    // hash the password
                    let hashedPassword = await bcrypt.hash(password, 10);
                    
                    // insert the data

                    pool.query(
                        `INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id, password`, [name,email,hashedPassword]   , (err, result) => {
                            if(err) {
                                console.log(err)
                                // errors.push({ message: "something went wrong please try again"});
                                // res.render("register", { errors })
                            } else if(result.rows.length > 0) {
                                console.log(result.rows)
                                req.flash('success_msg', "you are now registered , please log in")
                                res.redirect('/users/login')
                            }
                        }                 
                    )
                    // res.render("dash", {user: name});
                }
            }
        )
    }
}

