const helpers = require('../../helpers');

describe('Conversation Users', () => {
  let scopedConversationUser = null;

  /*
   * PUT
   */

  describe('PUT /conversations/:conversationId/users', () => {
    it('200s with created conversation user object', done => {
      const fields = {
        userId: testUserThree.id,
      };

      chai.request(server)
        .put(`/conversations/${testConversationOne.id}/users`)
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.conversationId.should.equal(testConversationOne.id);
          response.body.userId.should.equal(fields.userId);
          scopedConversationUser = response.body;
          done();
        });
    });

    it('200s with existing conversation user object', done => {
      const fields = {
        userId: scopedConversationUser.userId,
      };

      chai.request(server)
        .put(`/conversations/${testConversationOne.id}/users`)
        .set('X-Access-Token', testUserOne.accessToken)
        .send(fields)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.id.should.equal(scopedConversationUser.id);
          done();
        });
    });

    it('400s when not provided a user id', done => {
      chai.request(server)
        .put(`/conversations/${testConversationOne.id}/users`)
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(400);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('put', `/conversations/${testConversationOne.id}/users`);
  });

  /*
   * GET
   */

  describe('GET /conversations/:conversationId/users', () => {
    it('200s with an array of conversation user objects', done => {
      chai.request(server)
        .get(`/conversations/${testConversationOne.id}/users`)
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.be.at.least(1);
          response.body.forEach(conversationUser => {
            conversationUser.should.have.property('user');
            conversationUser.user.should.have.property('id');
            conversationUser.user.should.have.property('name');
            conversationUser.user.should.have.property('username');
            conversationUser.user.should.have.property('avatarAttachment');
          });
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('get', `/conversations/${testConversationOne.id}/users`);
  });

  /*
   * DELETE
   */

  describe('DELETE /conversations/:conversationId/users', () => {
    it('204s and deletes conversation user', done => {
      chai.request(server)
        .delete(`/conversations/${testConversationOne.id}/users/${scopedConversationUser.id}`)
        .set('X-Access-Token', testUserOne.accessToken)
        .end((error, response) => {
          helpers.logExampleResponse(response);
          response.should.have.status(204);
          done();
        });
    });

    helpers.it401sWhenUserAuthorizationIsInvalid('delete', `/conversations/${testConversationOne.id}/users`);
  });
});
