const express = require('express')
const router = express.Router();
const user = require("../models/user")
const { jwtAuthMiddleware, generateToken } = require('./../jwt')


router.post('/signup', async (req, res) => {
    try {
        const { role } = req.body;

        // Check if an admin already exists
        if (role === 'admin') {
            const adminExists = await user.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(401).json({ message: "Admin is already defined" });
            }
        }

        const data = req.body
        const newuser = new user(data);
        const response = await newuser.save();
        console.log("data saved")

        const payload = {
            id: response.id,
        }
        const token = generateToken(payload);
        console.log("token is", token)

        res.status(200).json({ response: response, token: token });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})

//login route
router.post('/login', async (req, res) => {
    try {

        const { aadharCardnumber, password } = req.body;
        const User = await user.findOne({ aadharCardnumber: aadharCardnumber })

        if (!User || !(await User.comparePassword(password))) {
            return res.status(401).json({ error: "invalid username or password" })
        }

        //generate token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        //return token as response
        res.json({ token })


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "initial server error" })

    }
})

router.get('/profile', jwtAuthMiddleware, async (req, res) => {

    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await person.findById(userId)
        res.status(200).json({ user })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "initial server error" })
    }

})

router.put("/profile/password", async (req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body;

        const user = await user.findById(userId);


        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: "invalid username or password" })
        }

        user.password = newPassword;
        await user.save()

        console.log('password updated')
        res.status(200).json({ message: "password updated" });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})

module.exports = router;