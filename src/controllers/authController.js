const User = require('../models/User');
const UserCode = require('../models/UserCode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../validation');
const sgMail = require('@sendgrid/mail')

const register = async (req, res) => {
    /**
     * TEMPORARILY DISABLE REGISTER SERVICE
     */
    const DISABLE = true;
    if (DISABLE) {
        return res.status(500).json({
            message: "Registration is not available"
        })
    }

    const isValid = registerValidation(req.body);

    if (!isValid) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        is_admin: false,
        password: hashed
    });

    const dbEmailUser = await User.findOne({ email: user.email });

    if (dbEmailUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    const dbUsernameUser = await User.findOne({ username: user.username });

    if (dbUsernameUser) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    try {
        const savedUser = await user.save()
        return res.send(savedUser);
    } catch (err) {
        return res.status(400).json({
            message: err.message
        });
    }
}

const login = async (req, res) => {
    const isValid = loginValidation(req.body);

    if (!isValid) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).json({
            message: "Email or password is wrong"
        });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Email or password is wrong"
        });
    }

    const payload = { _id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN)

    return res.header('auth-token', token).json({
        message: 'Login success',
        user: {
            name: user.name,
            username: user.username,
            email: user.email,
            is_admin: user.is_admin,
            token: token,
        }
    });
}

const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (email === undefined || code === undefined || newPassword === undefined) {
        return res.status(400).json({
            data: {
                error: {
                    message: "Invalid request: Must send email, code and new password",
                    status_code: 400
                }
            }
        });
    }

    const userCode = await UserCode.findOne({ email });

    if (userCode === undefined || userCode === null) {
        return res.status(400).json({
            data: {
                error: {
                    message: "Invalid request: Create password reset code before",
                    status_code: 400
                }
            }
        });
    }

    if (userCode.code !== code) {
        return res.status(400).json({
            data: {
                error: {
                    message: "Invalid request: Password reset code does not match",
                    status_code: 400
                }
            }
        });
    }

    const currentDate = new Date();

    if (currentDate.getTime() > userCode.code_last_date.getTime()) {
        return res.status(400).json({
            data: {
                error: {
                    message: "Invalid request: Password code is expired",
                    status_code: 400
                }
            }
        });
    }

    const dbUser = await User.findOne({ email });

    if (dbUser === undefined) {
        return res.status(500).json({
            data: {
                error: {
                    message: "Internal error: User not found in database",
                    status_code: 500
                }
            }
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        dbUser.password = hashed;

        await dbUser.save();
        await UserCode.deleteOne({ email });

        return res.status(200).json({
            data: {
                message: "Password changed successfully"
            }
        });
    } catch (e) {
        return res.status(500).json({
            data: {
                error: {
                    message: "Internal error: User update failed",
                    status_code: 500
                }
            }
        });
    }
}

const sendPasswordResetEmail = async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const { email } = req.body;

    if (email === undefined) {
        return res.status(400).json({
            data: {
                error: {
                    message: "Must specify an email address",
                    status_code: 400
                }
            }
        });
    }

    // Generate 5 character code
    const passwordResetCode = Math.random().toString(36).substr(2, 5);
    const TIME_INTERVAL_IN_MINUTES = 30;
    const MINUTES_TO_MILLIS = 60000;
    const codeLastDate = new Date((new Date()).getTime() + TIME_INTERVAL_IN_MINUTES * MINUTES_TO_MILLIS);

    const userCode = new UserCode({
        email: email,
        code: passwordResetCode,
        code_last_date: codeLastDate
    });

    let savedUserCode;

    try {
        savedUserCode = await userCode.save();
    } catch (err) {
        return res.status(500).json({
            data: {
                error: {
                    message: "Cannot create password reset code",
                    status_code: 500
                }
            }
        });
    }

    const emailMsg = {
        to: email,
        from: "contactvevericka@gmail.com",
        subject: "Vevericka Password Reset Code",
        text: "Vevericka Auth Service Password Reset Code",
        html: `Your one time password reset code is <strong>${passwordResetCode}</strong>. If you have a problem, please contact with Vevericka Support Team.`
    };

    try {
        await sgMail.send(emailMsg);
        return res.json({
            data: {
                message: "Email sent"
            }
        });
    } catch (e) {
        return res.status(500).json({
            data: {
                error: {
                    message: e.message
                }
            }
        });
    }
}

module.exports = {
    register,
    login,
    resetPassword,
    sendPasswordResetEmail
}