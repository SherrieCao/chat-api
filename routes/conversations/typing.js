/*
 * Route: /conversations/:conversationId/typing
 */

const conversationAssociate = rootRequire('/middlewares/conversations/associate');
const userAuthorize = rootRequire('/middlewares/users/authorize');

const router = express.Router({
  mergeParams: true
});

/*
 * POST
 */

router.post('/', userAuthorize);
router.post('/', conversationAssociate);
router.post('/', asyncMiddleware(async (request, response) => {
  // send MQTT chat event.

  response.success();
}));

/*
 * Export
 */

module.exports = router;