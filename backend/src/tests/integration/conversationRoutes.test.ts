import request from "supertest";
import app from "../../app";
import db from "../fixtures/db";

const {
  setupDatabase,
  userOne,
  userTwo,
  userThree,
  postOne,
  commentOne,
  //   conversationOne,
  messageOne,
  clearDatabaseRecords,
} = db;

beforeAll(async () => {
  console.log("Running ConversationRoutes tests...");
  await clearDatabaseRecords();
  await setupDatabase();
});

let conversationOneId: number;
let messageOneId: number;
const invalidTestUserId = "9a37cdc2-c69f-4b3a-a572-2c3e4cd197b6";

// router.post("/new", createConversation)
describe("Tests for POST '/new'", () => {
  test("Should not create new conversation without valid cookie", async () => {
    const response = await request(app).post(`/conversations/new`);

    expect(response.status).toEqual(400);
  });

  test("Should create new conversation with valid cookie", async () => {
    const response = await request(app)
      .post(`/conversations/new`)
      .send({
        members: [userTwo.id],
      })
      .set("Cookie", [userOne.cookieString as string]);
    expect(response.status).toEqual(200);

    expect(response.body.data.name).toBe(null);
    expect(response.body.data.id).toBeDefined();
    conversationOneId = response.body.data.id;
  });

  test("Should return an error if memberId does not exist", async () => {
    const response = await request(app)
      .post(`/conversations/new`)
      .send({
        members: [invalidTestUserId],
      })
      .set("Cookie", [userOne.cookieString as string]);
    expect(response.status).toEqual(500);
  });
});

// router.get("/user", getUserConversations)
describe("Tests for GET '/user'", () => {
  test("Should not fetch user's conversations without valid cookie", async () => {
    const response = await request(app).get(`/conversations/user`);

    expect(response.status).toEqual(400);
  });

  test("Should not fetch user's conversations without valid cookie", async () => {
    const response = await request(app)
      .get(`/conversations/user`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id).toBe(conversationOneId);
    expect(response.body.data[0].conversation_members.length).toBe(2);
    expect(response.body.data[0].messages.length).toBe(0);
  });
});

// router.post("/messages/:conversationId", createMessage)
describe("Tests for POST '/messages/:conversationId'", () => {
  test("Should not create new message without valid cookie", async () => {
    const response = await request(app)
      .post(`/conversations/messages/${conversationOneId}`)
      .send({
        content: messageOne.content,
      });

    expect(response.status).toEqual(400);
  });

  test("Should not create new message without valid conversationId", async () => {
    const response = await request(app)
      .post(`/conversations/messages/999`)
      .send({
        content: messageOne.content,
      })
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(400);
  });

  //   test("Should not create new message if conversation does not belong to user", async () => {
  //     const response = await request(app)
  //       .post(`/messages/new/999`)
  //       .send({
  //         content: messageOne.content
  //       })
  //       .set("Cookie", [userOne.cookieString as string]);

  //     expect(response.status).toEqual(400);
  //   });

  test("Should create new message with valid credentials and cookie", async () => {
    const response = await request(app)
      .post(`/conversations/messages/${conversationOneId}`)
      .send({
        content: messageOne.content,
      })
      .set("Cookie", [userOne.cookieString as string]);
    expect(response.status).toEqual(200);
    messageOneId = response.body.data.id;
  });
});

// router.post("/:conversationId", getConversationMessages)
describe("Tests for POST '/:conversationId'", () => {
  test("Should not fetch conversation's messages without valid cookie", async () => {
    const response = await request(app).post(
      `/conversations/${conversationOneId}`
    );

    expect(response.status).toEqual(400);
  });

  test("Should fetch conversation's messages with valid cookie", async () => {
    const response = await request(app)
      .post(`/conversations/${conversationOneId}`)
      .set("Cookie", [userOne.cookieString as string]);

    expect(response.status).toEqual(200);

    expect(response.status).toEqual(200);
    expect(response.body.data.id).toBe(conversationOneId);
    expect(response.body.data.conversation_members.length).toBe(2);
    expect(response.body.data.messages.length).toBe(1);
  });
});

// router.patch("/:conversationId/edit", editConversationDetails)



// router.patch("/:conversationId/edit/members", editConversationMembers)











// router.get("/all", getAllConversations);
// router.get("/messages/all", getAllMessages);
// router.post("/messages/:conversationId", createMessage)
// router.post("/new", createConversation)
// router.get("/user", getUserConversations)
// router.post("/:conversationId", getConversationMessages)
// router.patch("/:conversationId/edit/members", editConversationMembers)
// router.patch("/:conversationId/edit", editConversationDetails)