import { randomUUID } from "crypto";
import { date } from "yup";
import { dbFetchAllUsers, dbFetchAllFollows, dbFetchCurrentUserFollows, dbFetchUser, dbCreateUser, dbLogin, dbEditUserProfile, dbFetchFollowingId, dbFollowUser } from "../../../services/userService";
// import { follows, Prisma, PrismaClient, User } from "@prisma/client";

// const prisma = new PrismaClient();

test("", () => {
  
})

// test("should create a new user", async () => {
//   const user = {
//     email: 'hello@prisma.io',
//     password: "$2a$12$EQ8HWdM9UUWitMxkldUJreotHQrQPvHFkmD80hrPyjHkiGW8r819a",
//     id: "c65a6889-8788-4105-9d07-d6903ac711c2",
//     profile_photo: "",
//     created_at: new Date(),
//     updated_at: new Date(),
//     role: "",
//     is_active: true,
//     profile_summary: "",
//     display_name: "",

//   }
//   prismaMock.user.create.mockResolvedValue(user)
//   // const newUser = {
//   //   email: 'hello@prisma.io',
//   //   password: "test"
//   // }

//   await expect(dbCreateUser(user)).resolves.toEqual({
//     email: 'hello@prisma.io',
//     password: "$2a$12$EQ8HWdM9UUWitMxkldUJreotHQrQPvHFkmD80hrPyjHkiGW8r819a",
//     id: "c65a6889-8788-4105-9d07-d6903ac711c2",
//     created_at: new Date(),
//     updated_at: new Date(),
//     profile_photo: null,
//     role: null,
//     is_active: true,
//     profile_summary: null,
//     display_name: null
// })
// }

// );


// describe("dbFetchAllUsers", () => {
//   it("should return an array of all users", async () => {
//     const mockUsers: User[] = [{ id: "1", email: "test1@example.com" }, { id: "2", email: "test2@example.com" }];
//     const mockFindMany = jest.spyOn(prisma.user, "findMany").mockResolvedValue(mockUsers);
//     const result = await dbFetchAllUsers();

//     expect(mockFindMany).toHaveBeenCalled();
//     expect(result).toEqual(mockUsers);
//   });
// });

// describe("dbFetchAllFollows", () => {
//   it("should return an array of all follows", async () => {
//     const mockFollows: Prisma.Follows[] = [{ id: "1", user_id: "1", followed_user_id: "2" }, { id: "2", user_id: "3", followed_user_id: "4" }];
//     const mockFindMany = jest.spyOn(prisma.follows, "findMany").mockResolvedValue(mockFollows);
//     const result = await dbFetchAllFollows();

//     expect(mockFindMany).toHaveBeenCalled();
//     expect(result).toEqual(mockFollows);
//   });
// });

// describe("dbFetchCurrentUserFollows", () => {
//   it("should return an object containing followers and following arrays for the specified user", async () => {
//     const mockFollowing: Prisma.Follows[] = [{ id: "1", user_id: "1", followed_user_id: "2" }, { id: "2", user_id: "1", followed_user_id: "3" }];
//     const mockFollowers: Prisma.Follows[] = [{ id: "3", user_id: "2", followed_user_id: "1" }, { id: "4", user_id: "3", followed_user_id: "1" }];
//     const mockFindMany = jest.spyOn(prisma.follows, "findMany").mockResolvedValueOnce(mockFollowing).mockResolvedValueOnce(mockFollowers);
//     const result = await dbFetchCurrentUserFollows("1");

//     expect(mockFindMany).toHaveBeenCalled();
//     expect(result).toEqual({ followers: mockFollowers, following: mockFollowing });
//   });
// });