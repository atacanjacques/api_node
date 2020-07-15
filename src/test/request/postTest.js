// Set node environnements to test
process.env.NODE_ENV = 'test';

// Load dependencies
const mongoose = require("mongoose");
const Post = require('../../api/models/postModel');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app');
const should = chai.should();
const dbHandler = require('../db-handler');

// Use chai adddon chaiHttp
chai.use(chaiHttp);

// Connect to a new in-memory database before running any tests
before(async () => await dbHandler.connect());

// Clear all test data after every test
afterEach(async () => await dbHandler.clearDatabase());

// Remove and close the db and server
after(async () => await dbHandler.closeDatabase());


// Remove console.log function
console.log = function() {}

/**
* Tests on /posts uri
*/
describe('Request : Post', () => {

  /*
  * GET /posts
  */
  describe('GET /posts', () => {
    it('it should GET all the posts', (done) => {
      // Send a GET request to the /posts uri
      chai.request(server)
      .get('/posts')
      .end((err, res) => {
        res.should.have.status(200); // Verify that the response status is 200
        res.body.should.be.a('array'); // Verify that the response body is an array
        res.body.length.should.be.eql(0); // Verify that the response body is empty
        done(); // End of the test specs
      });
    });

    it('it should not GET all the posts', (done) => {
      // Send a GET request to the /posts uri
      chai.request(server)
      .get('/post') // Wrong uri. It shoud be /posts
      .end((err, res) => {
        res.should.have.status(404); // Verify that the response status is 404
        done(); // End of the test specs
      });
    });
  });

  /*
  * POST /posts
  */
  describe('POST /posts', () => {
    it('it should not POST a post without all required fields', (done) => {
      // Post data
      let postData = {
        content: "Lorem ipsum dolor sit amet"
      }
      // Send a POST request to the /posts uri with not complete datas
      chai.request(server)
      .post('/posts')
      .send(postData)
      .end((err, res) => {
        res.should.have.status(500); // Verify that the response status is 500
        res.body.should.be.a('object'); // Verify that the response body is an object
        res.body.should.have.property('message'); // Verify that the response body contain a "message" property
        res.body.message.should.equal('Erreur serveur.'); // Verify that the response body property "message" is equal to "Erreur serveur."
        done(); // End of the test specs
      });
    });

    it('it should POST a posts ', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Send a POST request to the /posts uri with datas
      chai.request(server)
      .post('/posts')
      .send(postData)
      .end((err, res) => {
        res.should.have.status(201); // Verify that the response status is 201
        res.body.should.be.a('object'); // Verify that the response body is an object
        // Verify that the response body contain the properties : id, title, content, created_at
        res.body.should.have.property('_id');
        res.body.should.have.property('title');
        res.body.should.have.property('content');
        res.body.should.have.property('created_at');
        done(); // End of the test specs
      });
    });
  });

  /*
  * GET /posts/:id
  */
  describe('GET /posts/:id', () => {
    it('it should GET a post by the given id', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Create a new Post model instance with post datas
      let post = new Post(postData);
      // Save the post in the database
      post.save((err, post) => {
        // Send a GET request to the /posts/:id uri
        chai.request(server)
        .get('/posts/' + post.id)
        .send(post)
        .end((err, res) => {
          res.should.have.status(200); // Verify that the response status is 201
          res.body.should.be.a('object'); // Verify that the response body is an object
          // Verify that the response body contain the properties : id, title, content, created_at
          res.body.should.have.property('_id');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('created_at');
          res.body.should.have.property('_id').eql(post.id);
          done(); // End of the test specs
        });
      });

    });

    it('it should not GET a post by the given id', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Create a new Post model instance with post datas
      let post = new Post(postData);
      // Save the post in the database
      post.save((err, post) => {
        // Send a GET request to the /posts/:id uri
        chai.request(server)
        .get('/posts/' + "randomId") // Non existing id
        .send(post)
        .end((err, res) => {
          res.should.have.status(500); // Verify that the response status is 500
          res.body.should.be.a('object'); // Verify that the response body is an object
          res.body.should.have.property('message'); // Verify that the response body contain a "message" property
          res.body.message.should.equal('Erreur serveur.'); // Verify that the response body property "message" is equal to "Erreur serveur."
          res.body.should.not.have.property('_id'); // Verify that the response body does not contain the id property
          done(); // End of the test specs
        });
      });

    });
  });

  /*
  * PUT /posts/:id
  */
  describe('PUT /posts/:id', () => {
    it('it should UPDATE a post given the id', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Create a new Post model instance with post datas
      let post = new Post(postData);
      // Save the post in the database
      post.save((err, post) => {
        // Send a PUT request to the /posts/:id uri with datas
        chai.request(server)
        .put('/posts/' + post.id)
        .send({title: "Nouveau nom d'article", content: "Nouveau contenu"}) // New datas
        .end((err, res) => {
          res.should.have.status(200); // Verify that the response status is 200
          res.body.should.be.a('object'); // Verify that the response body is an object
          res.body.should.have.property('title').eql("Nouveau nom d'article"); // Verify that the reponse body property title contain the new data
          res.body.should.have.property('content').eql("Nouveau contenu"); // Verify that the reponse body property content contain the new data
          res.body.should.have.property('title').not.eql("Article test"); // Verify that the reponse body property title doest not contain the old data
          res.body.should.have.property('content').not.eql("Lorem ipsum dolor sit amet");// Verify that the reponse body property content doest not contain the old data
          done(); // End of the test specs
        });
      });
    });

    it('it should not UPDATE a post given the id', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Create a new Post model instance with post datas
      let post = new Post(postData);
      // Save the post in the database
      post.save((err, post) => {
        // Send a PUT request to the /posts/:id uri with datas
        chai.request(server)
        .put('/posts/' + post.id)
        .send({}) // No new data
        .end((err, res) => { // End of the test specs{
          res.should.have.status(200); // Verify that the response status is 200
          res.body.should.be.a('object'); // Verify that the response body is an object
          res.body.should.have.property('title').eql("Article test"); // Verify that the reponse body property title contain the same data
          res.body.should.have.property('content').eql("Lorem ipsum dolor sit amet"); // Verify that the reponse body property content contain the same data
          res.body.should.have.property('title').not.eql("Nouveau nom d'article"); // Verify that the reponse body property title doest not contain new data
          res.body.should.have.property('content').not.eql("Nouveau contenu"); // Verify that the reponse body property content doest not contain new data
          done(); // End of the test specs
        });
      });
    });
  });

  /*
  * DELETE /posts/:id
  */
  describe('DELETE /posts/:id', () => {
    it('it should DELETE a post given the id', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Create a new Post model instance with post datas
      let post = new Post(postData);
      // Save the post in the database
      post.save((err, post) => {
        // Send a DELETE request to the /posts/:id uri
        chai.request(server)
        .delete('/posts/' + post.id)
        .end((err, res) => {
          res.should.have.status(200); // Verify that the response status is 200
          res.body.should.be.a('object'); // Verify that the response body is an object
          res.body.should.have.property('message').eql('Article supprimé'); // Verify that the response body contain a message property which contains "Article supprimé."
          done(); // End of the test specs
        });
      });
    });

    it('it should not DELETE a post given the id', (done) => {
      // Post data
      let postData = {
        title: "Article test",
        content: "Lorem ipsum dolor sit amet"
      }
      // Create a new Post model instance with post datas
      let post = new Post(postData);
      // Save the post in the database
      post.save((err, post) => {
        // Send a DELETE request to the /posts/:id uri
        chai.request(server)
        .delete('/posts/' + "randomId")
        .end((err, res) => {
          res.should.have.status(500); // Verify that the response status is 500
          res.body.should.be.a('object'); // Verify that the response body is an object
          res.body.should.have.property('message'); // Verify that the response body contain a "message" property
          res.body.message.should.equal('Erreur serveur.'); // Verify that the response body property "message" is equal to "Erreur serveur."
          done(); // End of the test specs
        });
      });
    });
  });

});
