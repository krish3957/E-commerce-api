const router = require('express').Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken');
//Register

router.post("/register", async (req, res) => {
    const { username, email, password, fname, lname, img } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).send({ error: true, message: 'User already exists' });
    }
    else {
        const newUser = new User({
            username: username,
            email: email,
            fname: fname,
            lname: lname,
            password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
            img: img || null,
            id: username

        });
        try {
            const savedUser = await newUser.save();
            return res.status(201).json({ error: false, message: savedUser });
        } catch (err) {
            return res.status(500).json;
        }
    }
})


//login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        !user && res.status(401).json({ error: true, message: "Cannot Find User, Please Register" });
        const hashedPass = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).json({ error: true, message: "Wrong Password!" });

        const accesTocken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accesTocken });
    }
    catch (err) {
        return res.status(500);
    }
})

module.exports = router;