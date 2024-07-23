const express = require('express')
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const candidate = require('../models/candidate');
const User = require('../models/user')

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        if (user.role === "admin") {
            return true;
        }

    } catch {
        return false;
    }
}

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {

        if (! await checkAdminRole(req.user.id))
            return res.status(403).json({ message: "user does  not have admin role" })

        const data = req.body
        const newCandidate = new candidate(data);

        const response = await newCandidate.save();
        console.log("data saved")
        res.status(200).json({ response: response });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})



router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
    try {

        if (! await checkAdminRole(req.user.id)) {
            return res.send(403).json({ message: "user does  not have admin role" })
        }


        const candidateId = req.params.candidateId;
        const updatedcandidateData = req.body;
        const response = await candidate.findByIdAndUpdate(candidateId, updatedcandidateData, {
            new: true,
            runValidators: true,
        })
        if (!response) {
            return res.status(404).json({ error: "candidate not found" })
        }
        console.log('data updated')
        res.status(200).json(response);

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})


router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
    try {

        if (! await checkAdminRole(req.user.id))
            return res.send(403).json({ message: "user does  not have admin role" })


        const candidateId = req.params.candidateId;

        const response = await candidate.findByIdAndDelete(candidateId)
        if (!response) {
            return res.status(404).json({ error: "candidate not found" })
        }
        console.log('data Deleted')
        res.status(200).json({ message: "Data deleted" });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})

//route for give vote
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    try {
        const Candidate = await candidate.findById(candidateID);
        if (!Candidate) {
            return res.status(404).json({ message: "candidate not found" });
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        if (user.isVoted) {
            return res.status(404).json({ message: "you have already voted" });
        }

        if (user.role == 'admin') {
            return res.status(404).json({ message: "admin is not allowed" });
        }

        Candidate.votes.push({ user: userID });
        Candidate.voteCount++;
        await Candidate.save();

        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "vote recorted successfully" });

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }

})

//vote count
router.get('/vote/count', async (req, res) => {
    try {
        const candidateList = await candidate.find().sort({ voteCount: "desc" });

        const voteRecord = candidateList.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })
        res.status(200).json(voteRecord)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})
module.exports = router;