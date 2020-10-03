const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");
test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});
const blog1 = [{ id: 1, title: "A", author: "a", url: "a.com", likes: 3 }];
describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(blog1);
    expect(result).toBe(3);
  });
  test("of bigger list is calculated right", () => {
    const result = listHelper.totalLikes(helper.blogs);
    expect(result).toBe(36);
  });
});

describe("favorite", () => {
  test("lists with many blogs returns the correct one", () => {
    const result = listHelper.favoriteBlog(helper.blogs);
    expect(result).toEqual({
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("mostBlog", () => {
  test("author with most blog", () => {
    const result = listHelper.mostBlog(helper.blogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
describe("mostLike", () => {
  test("author with most likes", () => {
    const result = listHelper.mostLike(helper.blogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
