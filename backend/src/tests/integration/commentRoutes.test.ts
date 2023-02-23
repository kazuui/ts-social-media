import request from "supertest";
import app from "../../app";
import db from "../fixtures/db";

const { setupDatabase, userOne, userTwo, postOne, commentOne, clearDatabaseRecords } = db;

beforeAll(async () => {
  console.log("Running PostRoutes tests...");
  await clearDatabaseRecords();
  await setupDatabase();
});

// router.get("/all", getAllComments);
// router.post("/post/:postId/feed", getPostPaginatedComments) // will change route name
// router.get("/post/:postId", getPostComments)
// router.post("/new/:postId", createComment)
// router.patch("/:commentId", editComment)
// router.delete("/:commentId", deleteComment)
// router.post("/:commentId/like", likeComment)
// router.post("/:commentId/unlike", unlikeComment)

const commentTwoDescription = "Comment 2 description";
const editedCommentTwoDescription = "New Comment 2 description";
let commentTwoId: number;

// router.get("/:postId", getPost)
describe("Tests for GET '/:postId'", () => {
    test("Should get post's comments with valid credentials", async () => {
      const response = await request(app)
        .get(`/comments/post/${postOne.id}`)
        .set("Cookie", [userOne.cookieString as string]);
  
      expect(response.status).toEqual(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(commentOne.id);
      expect(response.body.data[0].owner_id).toBe(userOne.id);
      expect(response.body.data[0].post_id).toBe(postOne.id);
      expect(response.body.data[0].description).toBe(commentOne.description);
      expect(response.body.data[0].is_active).toBe(true);
      expect(response.body.data[0].users.id).toBe(userOne.id);
      expect(response.body.data[0]._count.comment_likes).toBe(0);
    });
  
    test("Should not get post's comments without valid cookie", async () => {
      const response = await request(app).get(`/comments/post/${postOne.id}`);
  
      expect(response.status).toEqual(400);
    });
  
    test("Should return an error if postId does not exist", async () => {
      const response = await request(app).get(`/comments/post/999`);
  
      expect(response.status).toEqual(400);
    });
  });

// router.post("/new/:postId", createComment)
describe("Tests for POST '/new/:postId'", () => {
  test("Should create a new comment with valid credentials", async () => {
    const response = await request(app)
      .post(`/comments/new/${postOne.id}`)
      .send({
        description: commentTwoDescription,
      })
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);

    commentTwoId = response.body.data.id;

    expect(response.body.data.owner_id).toBe(userOne.id);
    expect(response.body.data.description).toBe(commentTwoDescription);
    expect(response.body.data.is_active).toBe(true);
  });

  test("Should not create a new comment without valid cookie", async () => {
    const response = await request(app)
      .post(`/comments/new/${postOne.id}`)
      .send({
        description: commentTwoDescription,
      });

    expect(response.status).toEqual(400);
  });
});

// router.patch("/:commentId", editComment)
describe("Tests for PATCH '/:commentId'", () => {
    test("Should edit comment details with valid credentials", async () => {
      const response = await request(app)
        .patch(`/comments/${commentTwoId}`)
        .send({
          description: editedCommentTwoDescription,
        })
        .set("Cookie", [userOne.cookieString as string]);
  
      expect(response.status).toEqual(200);
      expect(response.body.data.owner_id).toBe(userOne.id);
      expect(response.body.data.description).toBe(editedCommentTwoDescription);
    });
  
    test("Should not edit comment details without valid cookie", async () => {
      const response = await request(app).patch(`/comments/${commentTwoId}`);

      expect(response.status).toEqual(400);
    });
  
    test("Should return an error if commentId does not exist", async () => {
        const response = await request(app)
        .patch(`/comments/999`)
        .send({
          description: editedCommentTwoDescription,
        })
        .set("Cookie", [userOne.cookieString as string]);
  
      expect(response.status).toEqual(404);
    });
  
    test("Should not edit a comment that does not belong to user", async () => {
        const response = await request(app)
        .patch(`/comments/${commentTwoId}`)
        .send({
          description: editedCommentTwoDescription,
        })
        .set("Cookie", [userTwo.cookieString as string]);
      expect(response.status).toEqual(400);

    });
  });
  