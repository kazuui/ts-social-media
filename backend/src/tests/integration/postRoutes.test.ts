import request from "supertest";
import app from "../../app";
import db from "../fixtures/db";

const { setupDatabase, userOne, userTwo, postOne, clearDatabaseRecords } = db;

beforeAll(async () => {
  console.log("Running PostRoutes tests...");
  await clearDatabaseRecords();
  await setupDatabase();
});

const postTwoDescription = "Post 2 description";
const editedPostTwoDescription = "New Post 2 description";
let postTwoId: number;

// router.post("/new", createPost)
describe("Tests for POST '/new'", () => {
  test("Should create a new post with valid credentials", async () => {
    const response = await request(app)
      .post("/posts/new")
      .send({
        description: postTwoDescription,
      })
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);
    expect(response.body.data.owner_id).toBe(userOne.id);
    expect(response.body.data.description).toBe(postTwoDescription);
    expect(response.body.data.is_active).toBe(true);
    expect(response.body.data.photo).toBe(null);
    postTwoId = response.body.data.id;
  });

  test("Should not create a new post without valid cookie", async () => {
    const response = await request(app).post("/posts/new").send({
      description: postTwoDescription,
    });
    expect(response.status).toEqual(400);
  });
});

// router.get("/:postId", getPost)
describe("Tests for GET '/:postId'", () => {
  test("Should get post details with valid credentials", async () => {
    const response = await request(app)
      .get(`/posts/${postTwoId}`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);
    expect(response.body.data.owner_id).toBe(userOne.id);
    expect(response.body.data.description).toBe(postTwoDescription);
    expect(response.body.data.is_active).toBe(true);
    expect(response.body.data.photo).toBe(null);
    expect(response.body.data.users.id).toBe(userOne.id);
    expect(response.body.data._count.post_likes).toBe(0);
  });

  test("Should not get post details without valid cookie", async () => {
    const response = await request(app).get(`/posts/${postTwoId}`);
    // .set("Cookie", [cookie]);
    expect(response.status).toEqual(400);
  });

  test("Should return an error if postId does not exist", async () => {
    const response = await request(app)
      .get(`/posts/9999`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(404);
  });
});

// // router.patch("/:postId", editPost)
describe("Tests for PATCH '/:postId'", () => {
  test("Should edit post details with valid credentials", async () => {
    const response = await request(app)
      .patch(`/posts/${postTwoId}`)
      .send({
        description: editedPostTwoDescription,
      })
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);
    expect(response.body.data.owner_id).toBe(userOne.id);
    expect(response.body.data.description).toBe(editedPostTwoDescription);
    expect(response.body.data.is_active).toBe(true);
    expect(response.body.data.photo).toBe(null);
    // expect(response.body.data.users.id).toBe(userOne.id);
    // expect(response.body.data._count.post_likes).toBe(0);
  });

  test("Should not edit post details without valid cookie", async () => {
    const response = await request(app).patch(`/posts/${postTwoId}`);
    // .set("Cookie", [cookie]);
    expect(response.status).toEqual(400);
  });

  test("Should return an error if postId does not exist", async () => {
    const response = await request(app)
      .patch(`/posts/9999`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(404);
  });

  test("Should not edit a post that does not belong to user", async () => {
    const response = await request(app)
      .patch(`/posts/${postTwoId}`)
      .send({
        description: postTwoDescription,
      })
      .set("Cookie", [userTwo.cookieString as string]);

    expect(response.status).toEqual(400);
  });
});

// router.delete("/:postId", deletePost)
describe("Tests for DELETE '/:postId'", () => {
  test("Should not delete post without valid credentials", async () => {
    const response = await request(app).delete(`/posts/${postOne.id}`);
    //   .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(400);
  });

  test("Should not delete post that does not belong to user", async () => {
    const response = await request(app)
      .delete(`/posts/${postOne.id}`)
      .set("Cookie", [userTwo.cookieString as string]);

    expect(response.status).toEqual(400);
  });

  test("Should delete post with valid credentials", async () => {
    const response = await request(app)
      .delete(`/posts/${postOne.id}`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);

    const postOneResponse = await request(app)
      .get(`/posts/${postOne.id}`)
      .set("Cookie", [userOne.cookieString as string]);
    expect(postOneResponse.status).toEqual(404);
  });
});

// // router.post("/:postId/like", likePost)
describe("Tests for POST '/:postId/like'", () => {
  test("Should not like post without valid credentials", async () => {
    const response = await request(app).post(`/posts/${postOne.id}/like`);
    //   .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(400);
  });

  test("Should like post with valid credentials", async () => {
    const response = await request(app)
      .post(`/posts/${postTwoId}/like`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);

    const postOneResponse = await request(app)
      .get(`/posts/${postTwoId}`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(postOneResponse.body.data.id).toBe(postTwoId);
    expect(postOneResponse.body.data._count.post_likes).toBe(1);
  });

  test("Should return error if post does not exist", async () => {
    const response = await request(app)
      .post(`/posts/999/like`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(500);
  });
});

// // router.post("/:postId/unlike", unlikePost)
describe("Tests for POST '/:postId/unlike'", () => {
  test("Should not unlike post without valid credentials", async () => {
    const response = await request(app).post(`/posts/${postOne.id}/unlike`);
    //   .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(400);
  });

  test("Should unlike post with valid credentials", async () => {
    const response = await request(app)
      .post(`/posts/${postTwoId}/unlike`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);

    const postOneResponse = await request(app)
      .get(`/posts/${postTwoId}`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(postOneResponse.body.data.id).toBe(postTwoId);
    expect(postOneResponse.body.data._count.post_likes).toBe(0);
  });

  test("Should return error if post does not exist", async () => {
    const response = await request(app)
      .post(`/posts/999/unlike`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(400);
  });
});
