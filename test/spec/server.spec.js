var Request = require('request');

//const server = require('../../loginapp-server-master/server');

describe('BackentFunctinalTestSuite',() =>{
    var serverUrl = 'http://localhost:3000';
    
    it('should login user', (done) =>{
        Request.post(serverUrl+'/login', {json: true, body: {username : "aaa@a.com", password: 'a'}}, (req, res) => {
            console.log("karam" + JSON.stringify(res));
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.msg).toEqual('Login success');
            done();
        });
    });

    it('should NOT login user', (done) =>{
        Request.post(serverUrl+'/login', {json: true, body: {username : "x@c.com", password: 'a'}}, (req, res) => {
            expect(res.statusCode).toEqual(401);
            expect(res.body.msg).toBe('Invalid credentials, user does not exist.');
            done();
        });
    });


    it('should create user', (done) =>{
        Request.post(serverUrl+'/register', {json: true, body: {username: "tester", email : Math.random()+"@test.com", password: "test"}}, (req, res) => {
            expect(201).toEqual(res.statusCode);
            expect(true).toBe(res.body.success);
            expect('User created').toEqual(res.body.msg)
            done();
        });
    });

    it('should faile with error user already exist', (done) =>{
        Request.post(serverUrl+'/register', {json: true, body: {username: "tester", email : "test@test.com", password: "test"}}, (req, res) => {
            expect(208).toEqual(res.statusCode);
            expect(false).toBe(res.body.success);
            expect('Already exists').toEqual(res.body.msg)
            done();
        });
    });

    // it('should block as user login afte 3 try', (done) =>{
    //     Request.post(serverUrl+'/login', {json: true, body: {username : "c@c.com", password: 'a'}}, (req, res) => {
    //         Request.post(serverUrl+'/login', {json: true, body: {username : "c@c.com", password: 'a'}}, (req, res) => {
    //             Request.post(serverUrl+'/login', {json: true, body: {username : "c@c.com", password: 'a'}}, (req, res) => {
    //                 expect(res.statusCode).toEqual(403);
    //                 expect(res.data.msg).toEqual('Your account is blocked due to 3 failed login attempts.');
    //                 done();
    //             });
    //         });
    //     });
    // });


    // it('should list all users', function (done) {
    //     request.get(endpoint+'/users', function (request, response) {
    //         expect(response.statusCode).toEqual(200);
    //         done();
    //     });
    // });
})