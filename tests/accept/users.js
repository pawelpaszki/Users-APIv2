var logger = require('winston');
var server = require('../../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var seed = require('../../seed/seed');
var User = require('../../models/user');
var expect = require('chai').expect;

chai.should();
chai.use(chaiHttp);

var url = 'http://127.0.0.1:8001';

// details of user instance used in tests
function getTestUserDetails() {
  return {
    "gender": "male",
    "name": {
      "title": "mr",
      "first": "john",
      "last": "random"
    },
    "location": {
      "street": "109 the avenue",
      "city": "Newbridge",
      "state": "ohio",
      "zip": 28782
    },
    "email": "john.random@example.com",
    "username": "tinywolf709",
    "password": "rockon",
    "salt": "lypI10wj",
    "md5": "bbdd6140e188e3bf68ae7ae67345df65",
    "sha1": "4572d25c99aa65bbf0368168f65d9770b7cacfe6",
    "sha256": "ec0705aec7393e2269d4593f248e649400d4879b2209f11bb2e012628115a4eb",
    "registered": 1237176893,
    "dob": 932871968,
    "phone": "031-541-9181",
    "cell": "081-647-4650",
    "PPS": "3302243T",
    "picture": {
      "large": "https://randomuser.me/api/portraits/women/60.jpg",
      "medium": "https://randomuser.me/api/portraits/med/women/60.jpg",
      "thumbnail": "https://randomuser.me/api/portraits/thumb/women/60.jpg"
    }
  };
}

describe('Users', function() {

  // Before our test suite
  before(function(done) {
    // Start our app on an alternative port for acceptance tests
    server.listen(8001, function() {
      logger.info('Listening at http://localhost:8001 for acceptance tests');

      // Seed the DB with our users
      seed(function(err) {
        done(err);
      });
    });
  });

  describe('/GET users', function() {
    it('should return a list of users', function(done) {
      chai.request(url)
        .get('/users')
        .end(function(err, res) {
          res.body.should.be.a('array');
          res.should.have.status(200);
          res.body.length.should.be.eql(100);
          done();
        });
    });
  });

  describe('/GET users/:id', function() {
    it('should return a single user', function(done) {
      // Find a user in the DB
      User.findOne({}, function(err, user) {
        var id = user._id;

        // Read this user by id
        chai.request(url)
          .get('/users/' + id)
          .end(function(err, res) {
            res.should.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body.name.first).to.be.a('string');
            done();
          });
      });
    });
  });
  
  describe('/POST user', function() {
    it('should create a user', function(done) {
      // create user with given parameters
      user = getTestUserDetails();
      chai.request(url)
        .post('/users/create')
        .send(user)
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.be.a('object');
          expect(res.body.name.first).to.be.a('string');
          expect(res.body.name.last).to.be.a('string');
          expect(res.body.location.zip).to.be.a('number');
          expect(res.body.username).to.be.a('string');
          expect(res.body.password).to.be.a('string');
          expect(res.body.dob).to.be.a('number');
          expect(res.body.registered).to.be.a('number');
          done();
        });
    });
  });
  
});
