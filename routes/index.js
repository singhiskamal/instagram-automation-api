const express = require('express');
const router = express.Router();
const InstagramAutomation = require('../api/instagtam-automation');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/hash-tag-likes', function (req, res, next) {
    InstagramAutomation.autoLikeHashtagsPost(req, res)
});
router.get('/page-post-likes', function (req, res, next) {
    InstagramAutomation.autoLikeInfluencerPost(req, res)
});

module.exports = router;
