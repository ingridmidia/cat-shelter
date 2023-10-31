const router = require('express').Router();
const { Shelter } = require('../../models');

// Creates a new shelter /api/shelter/
router.post('/', async (req, res) => {
    try {
        const shelterData = await Shelter.create(req.body);

        req.session.save(() => {
            req.session.shelter_id = shelterData.id;
            req.session.logged_in = true;

            res.status(200).json(shelterData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Login route /api/shelter/login
router.post('/login', async (req, res) => {
    try {
        const shelterData = await Shelter.findOne({ where: { username: req.body.username } });

        if (!shelterData) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        const validPassword = await shelterData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.shelter_id = shelterData.id;
            req.session.logged_in = true;

            res.json({ shelter: shelterData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

// Logout route /api/shelter/logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;