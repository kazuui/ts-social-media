import { TextDecoderStream } from "stream/web";
import request from "supertest";
import app from "../../app";
import db from "../fixtures/db";
import { getUserIdFromJWT } from "../helpers/helpers";

const { setupDatabase, userOne, userTwo, prisma } = db;


beforeAll(async () => {
  console.log("before all tests...");
  await setupDatabase();
  // const prisma = new PrismaClient();
});

afterAll(async () => {
  console.log("after all tests...");
  await prisma.follows.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

// test("Should signup a new user", async () => {
//    const response = await request(app).post('/users').send({
//         userOne
//     }).expect(201)

//     // Assert that the database was changed correctly
//     // const user = await prisma.user.findById(response.body.user.id)
//     // expect(user).not.toBeNull()

//     //Assertions about the response
//     // expect(response.body.email).toBe("123@.com")
//     // expect(response.body).toMatchObject({
//     //     user: {
//     //         email: "123@.com"
//     //     },
//     //     token: user.token[0].token
//     // })
// })

// const isValidUserOne = (res) => {
//     res.body.user.should.have.property("user");
// }

let cookie: string;
let userOneId: string;
let userTwoId: string;
const invalidTestUserId = "9a37cdc2-c69f-4b3a-a572-2c3e4cd197b6";

describe("test env", () => {
  it("ENV", () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
  });
});

describe("Tests for POST '/login'", () => {
  test("Should login userOne with valid credentials", async () => {
    const response = await request(app).post("/users/login").send({
      email: userOne.email,
      password: userOne.password,
    });

    expect(response.status).toEqual(200);

    cookie = response.headers["set-cookie"][0];
    //removes start "jwt=" and end ";"
    const jwtString = cookie.split(" ")[0].replace("jwt=", "").replace(";", "");
    userOneId = await getUserIdFromJWT(jwtString);
  });
  test("Should not login userOne with wrong email", async () => {
    const response = await request(app).post("/users/login").send({
      email: "testemail@test.com",
      password: userOne.password,
    });
    expect(response.status).toEqual(404);
  });
  test("Should not login userOne with invalid password", async () => {
    const response = await request(app).post("/users/login").send({
      email: userOne.email,
      password: "",
    });
    expect(response.status).toEqual(400);
  });
});

describe("Tests for POST '/signup'", () => {
  test("Should create a new user with valid email and password", async () => {
    const response = await request(app).post("/users/signup").send({
      email: userTwo.email,
      password: userTwo.password,
    });
    userTwoId = response.body.data.id;
    expect(response.status).toEqual(200);
    expect(response.body.data.email).toBe(userTwo.email);
    // expect(response.body.data.password).toBe(null);
    
  });
  test("Should not create new user with invalid password", async () => {
    const response = await request(app).post("/users/signup").send({
      email: "validemail@email.com",
      password: "",
    });
    expect(response.status).toEqual(406);
  });

  test("Should not create new user with invalid email", async () => {
    const response = await request(app).post("/users/signup").send({
      email: "invalidemail",
      password: userTwo.password,
    });
    expect(response.status).toEqual(406);
  });
  test("Should not create user with duplicate email", async () => {
    const response = await request(app).post("/users/signup").send({
      email: userTwo.email,
      password: userTwo.password,
    });
    expect(response.status).toEqual(400);
  });
});

describe("Tests for GET '/:id'", () => {
  test("Should find user with valid cookie", async () => {
    const response = await request(app)
      .get(`/users/${userOneId}`)
      .set("Cookie", [cookie]);
    expect(response.status).toEqual(200);
  });

  test("Should not find user without valid cookie", async () => {
    const response = await request(app).get(`/users/${userOneId}`);
    expect(response.status).toEqual(400);
  });

  test("Should return server error with invalid userId", async () => {
    const response = await request(app).get(`/users/invalidId`);
    expect(response.status).toEqual(400);
  });

  describe("Tests for PATCH '/editprofile'", () => {
    let editedUserData = {
      email: "123@test.com",
      profile_summary: "test",
      display_name: "new display name",
    };

    test("Should edit own profile with valid credentials", async () => {
      const response = await request(app)
        .patch("/users/editprofile")
        .set("Cookie", [cookie])
        .send(editedUserData);
      expect(response.status).toEqual(200);
      expect(response.body.user.email).toBe(editedUserData.email);
      expect(response.body.user.profile_summary).toBe(editedUserData.profile_summary);
      expect(response.body.user.display_name).toBe(editedUserData.display_name);
    });

    test("Should not edit profile without valid cookie", async () => {
      const response = await request(app)
        .patch("/users/editprofile")
        .send(editedUserData);
      expect(response.status).toEqual(400);
    });

    test("Should not edit un-permissable fields", async () => {
      const response = await request(app)
        .patch("/users/editprofile")
        .set("Cookie", [cookie])
        .send({
          id: invalidTestUserId,
          role: "admin",
          is_active: false,
        });
      expect(response.status).toEqual(500);
    });
  });

  describe("Tests for POST '/:id/follow'",() => {
    test("Should follow userTwo with valid userId", async () => {
        const response = await request(app)
        .post(`/users/${userTwoId}/follow`)
        .set("Cookie", [cookie])
        .send();

        expect(response.status).toEqual(200);
    })

    test("Should return error without valid cookie", async () => {
        const response = await request(app)
        .post(`/users/${userTwoId}/follow`)
        .send();

        expect(response.status).toEqual(400);
      });

      test("Should not follow a non-existent user", async () => {
        const response = await request(app)
        .post(`/users/${invalidTestUserId}/follow`)
        .set("Cookie", [cookie])
        .send();

        expect(response.status).toEqual(500);
      });
  })

  describe("Tests for GET '/follows'",() => {
    test("Should return userTwo as a followed user", async () => {
        const response = await request(app)
        .get(`/users/follows`)
        .set("Cookie", [cookie])

        expect(response.status).toEqual(200);
        expect(response.body.data.following.length).toBe(1);
        expect(response.body.data.following[0]).toHaveProperty('followed_user_id', userTwoId);
        expect(response.body.data.followers.length).toBe(0);
    })

    test("Should return error without valid cookie", async () => {
        const response = await request(app)
        .get(`/users/follows`)

        expect(response.status).toEqual(400);
      });
  })

  describe("Tests for POST '/:id/unfollow'",() => {
    test("Should return error without valid cookie", async () => {
        const response = await request(app)
        .post(`/users/${userTwoId}/unfollow`)
        .send();

        expect(response.status).toEqual(400);
      });

      test("Should not unfollow a non-existent user", async () => {
        const response = await request(app)
        .post(`/users/${invalidTestUserId}/unfollow`)
        .set("Cookie", [cookie])
        .send();

        expect(response.status).toEqual(500);
      });

      test("Should unfollow userTwo with valid userId", async () => {
        const response = await request(app)
        .post(`/users/${userTwoId}/unfollow`)
        .set("Cookie", [cookie])
        .send();

        expect(response.status).toEqual(200);
    })

    test("UserOne's follows should not contain any users", async () => {
        const response = await request(app)
        .get(`/users/follows`)
        .set("Cookie", [cookie])

        expect(response.status).toEqual(200);
        expect(response.body.data.following.length).toBe(0);
        expect(response.body.data.followers.length).toBe(0);
    })
  })
  

});


test("should upload image", async () => {
    
  //toBe uses strict equality, toEqual uses an algorithm to compare instead,, so it can be used on objects
});
