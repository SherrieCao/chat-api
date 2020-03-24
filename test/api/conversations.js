const helpers = require('../helpers');

describe('Conversations', () => {
  let scopedConversation = null;

  /*
   * POST
   */

  describe('POST /conversations', () => {
    it('200s with created conversation object', done => {
      const fields = {
        permission: 'public',
        conversationMessage: {
          text: 'test test test!',
        },
      };

      chai.request(server)
        .post('/conversations')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.userId.should.equal(testUserOne.id);
          response.body.permission.should.equal(fields.permission),
          response.body.conversationMessages.should.be.an('array');
          response.body.conversationMessages[0].userId.should.equal(testUserOne.id);
          response.body.conversationMessages[0].text.should.equal(fields.conversationMessage.text);
          response.body.conversationUsers.should.be.an('array');
          response.body.conversationUsers[0].userId.should.equal(testUserOne.id);
          scopedConversation = response.body;
          done();
          helpers.logExampleResponse(response);
        });
    });

    it('400s when not provided content for conversationMessage', done => {
      const fields = {
        permission: 'public',
      };

      chai.request(server)
        .post('/conversations')
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(400);
          done();
          helpers.logExampleResponse(response);
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('post', '/conversations');
  });

  /*
   * GET
   */

  describe('GET /conversations', () => {
    it('200s with an array of conversations owned by the authorized user', done => {
      chai.request(server)
        .get('/conversations')
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.forEach(conversation => {
            conversation.userId.should.equal(testUserOne.id);
            conversation.conversationMessages.should.be.an('array');
            conversation.conversationUsers.should.be.an('array');
            conversation.user.should.be.an('object');
          });
          done();
          helpers.logExampleResponse(response);
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', '/conversations');
  });

  /*
   * PATCH
   */

  describe('PATCH /conversations', () => {
    it('200s with updated conversation object', done => {
      const fields = {
        permission: 'private',
      };

      chai.request(server)
        .patch(`/conversations/${scopedConversation.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.permission.should.equal(fields.permission);
          done();
          helpers.logExampleResponse(response);
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('patch', '/conversations');
  });

  /*
   * DELETE
   */

  describe('DELETE /conversations', () => {
    it('204s and deletes conversation', done => {
      chai.request(server)
        .delete(`/conversations/${scopedConversation.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          response.should.have.status(204);
          done();
          helpers.logExampleResponse(response);
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', '/conversations');
  });
});
