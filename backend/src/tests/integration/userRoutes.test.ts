import request from "supertest";
import app from "../../app";
import db from "../fixtures/db";

const { setupDatabase, userOne, userThree, userFour,clearDatabaseRecords } = db;

beforeAll(async () => {
  console.log("Running UserRoutes tests...");
  await clearDatabaseRecords();
  await setupDatabase();
});

let userFourId: string;
const invalidTestUserId = "9a37cdc2-c69f-4b3a-a572-2c3e4cd197b6";

describe("test env", () => {
  it("ENV", () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
  });
});

// router.route("/login").post(login)
describe("Tests for POST '/login'", () => {
  test("Should login userOne with valid credentials", async () => {
    const response = await request(app).post("/users/login").send({
      email: userOne.email,
      password: userOne.password,
    });

    expect(response.status).toEqual(200);

    // cookie = response.headers["set-cookie"][0];

    //removes start "jwt=" and end ";"
    // const jwtString = ABC.split(" ")[0].replace("jwt=", "").replace(";", "");
    // userOneId = await getUserIdFromJWT(jwtString);
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

// router.route("/signup").post(signup)
describe("Tests for POST '/signup'", () => {
  test("Should create a new user with valid email and password", async () => {
    const response = await request(app).post("/users/signup").send({
      email: userFour.email,
      password: userFour.password,
    });
    userFourId = response.body.data.id;
    expect(response.status).toEqual(200);
    expect(response.body.data.email).toBe(userFour.email);
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
      password: userFour.password,
    });
    expect(response.status).toEqual(406);
  });
  test("Should not create user with duplicate email", async () => {
    const response = await request(app).post("/users/signup").send({
      email: userFour.email,
      password: userFour.password,
    });
    expect(response.status).toEqual(400);
  });
});

// router.get("/:id", getUser);
describe("Tests for GET '/:id'", () => {
  test("Should find user with valid cookie", async () => {
    const response = await request(app)
      .get(`/users/${userOne.id}`)
      .set("Cookie", [userOne.cookieString as string]);
    expect(response.status).toEqual(200);
  });

  test("Should not find user without valid cookie", async () => {
    const response = await request(app).get(`/users/${userOne.id}`);
    expect(response.status).toEqual(400);
  });

  test("Should return server error with invalid userId", async () => {
    const response = await request(app).get(`/users/invalidId`);
    expect(response.status).toEqual(400);
  });

  // router.route("/editprofile").patch(editUserProfile)
  describe("Tests for PATCH '/editprofile'", () => {
    let editedUserData = {
      email: "123@test.com",
      profile_summary: "test",
      display_name: "new display name",
    };

    test("Should edit own profile with valid credentials", async () => {
      const response = await request(app)
        .patch("/users/editprofile")
        .set("Cookie", [userOne.cookieString as string])
        .send(editedUserData);
      expect(response.status).toEqual(200);
      expect(response.body.user.email).toBe(editedUserData.email);
      expect(response.body.user.profile_summary).toBe(
        editedUserData.profile_summary
      );
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
        .set("Cookie", [userOne.cookieString as string])
        .send({
          id: invalidTestUserId,
          role: "admin",
          is_active: false,
        });
      expect(response.status).toEqual(500);
    });
  });

  // router.post("/:id/follow", followUser);
  describe("Tests for POST '/:id/follow'", () => {
    test("Should follow userFour with valid userId", async () => {
      const response = await request(app)
        .post(`/users/${userFourId}/follow`)
        .set("Cookie", [userOne.cookieString as string])
        .send();

      expect(response.status).toEqual(200);
    });

    test("Should return error without valid cookie", async () => {
      const response = await request(app)
        .post(`/users/${userFourId}/follow`)
        .send();

      expect(response.status).toEqual(400);
    });

    test("Should not follow a non-existent user", async () => {
      const response = await request(app)
        .post(`/users/${invalidTestUserId}/follow`)
        .set("Cookie", [userOne.cookieString as string])
        .send();

      expect(response.status).toEqual(500);
    });
  });

  // router.get("/follows", getFollows)
  describe("Tests for GET '/follows'", () => {
    test("Should return userFour as a followed user", async () => {
      const response = await request(app)
        .get(`/users/follows`)
        .set("Cookie", [userOne.cookieString as string]);

      expect(response.status).toEqual(200);
      expect(response.body.data.following.length).toBe(1);
      expect(response.body.data.following[0]).toHaveProperty(
        "followed_user_id",
        userFourId
      );
      expect(response.body.data.followers.length).toBe(0);
    });

    test("Should return error without valid cookie", async () => {
      const response = await request(app).get(`/users/follows`);

      expect(response.status).toEqual(400);
    });
  });

  // router.post("/:id/unfollow", unfollowUser);
  describe("Tests for POST '/:id/unfollow'", () => {
    test("Should return error without valid cookie", async () => {
      const response = await request(app)
        .post(`/users/${userFourId}/unfollow`)
        .send();

      expect(response.status).toEqual(400);
    });

    test("Should not unfollow a non-existent user", async () => {
      const response = await request(app)
        .post(`/users/${invalidTestUserId}/unfollow`)
        .set("Cookie", [userOne.cookieString as string])
        .send();

      expect(response.status).toEqual(500);
    });

    test("Should unfollow userFour with valid userId", async () => {
      const response = await request(app)
        .post(`/users/${userFourId}/unfollow`)
        .set("Cookie", [userOne.cookieString as string])
        .send();

      expect(response.status).toEqual(200);
    });

    test("UserOne's follows should not contain any users", async () => {
      const response = await request(app)
        .get(`/users/follows`)
        .set("Cookie", [userOne.cookieString as string]);

      expect(response.status).toEqual(200);
      expect(response.body.data.following.length).toBe(0);
      expect(response.body.data.followers.length).toBe(0);
    });
  });
});

// test("should upload image", async () => {

//   //toBe uses strict equality, toEqual uses an algorithm to compare instead,, so it can be used on objects
// });
