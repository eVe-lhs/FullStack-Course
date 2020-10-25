describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    cy.visit("http://localhost:3000");
    cy.request("POST", "http://localhost:3001/api/users", {
      username: "lin",
      name: "Lin Htet Swe",
      password: "lhs",
    });
    cy.request("POST", "http://localhost:3001/api/users", {
      username: "someone",
      name: "Someone",
      password: "secret",
    });
  });

  it("Login form is shown", function () {
    cy.get("#login_form").contains("username");
    cy.get("#login_form").contains("password");
  });
  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("lin");
      cy.get("#password").type("lhs");
      cy.get("#login_button").click();
      cy.contains("Lin Htet Swe logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("wrong");
      cy.get("#password").type("wrong");
      cy.get("#login_button").click();
      cy.get("html").should("not.contain", "wrong logged in");
      cy.get(".error").should("have.css", "border-color", "rgb(255, 0, 0)"); // yields 'sans-serif'
      cy.get(".error").contains("Invalid password or username");
    });
  });
  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "lin", password: "lhs" });
    });
    it("user can create new blog", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("This is the title");
      cy.get("#author").type("someone");
      cy.get("#url").type("someurl.com");
      cy.contains("Create").click();
      cy.get(".success").should("have.css", "border-color", "rgb(0, 128, 0)");
      cy.get(".success").contains(
        "a new blog This is the title by someone is added"
      );
      cy.contains("This is the title");
    });
    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "Some Title",
          author: "Someone",
          url: "someurl.com",
        });
        cy.createBlog({
          title: "Other Title",
          author: "Otherone",
          url: "otherurl.com",
          likes: 2,
        });
        cy.createBlog({
          title: "Another Title",
          author: "Anotherone",
          url: "Anotherurl.com",
          likes: 1,
        });
      });
      it("user can like a blog", function () {
        cy.contains("Some Title").contains("view").click();
        cy.get("#likeButton").click();
        cy.contains("likes:1");
      });
      it("user can remove the blog", function () {
        cy.contains("Some Title").contains("view").click();
        cy.contains("remove").click();
        cy.get("html").should("not.contain", "Some Title");
      });
      it("other user cannot delete the blog", function () {
        cy.contains("Log Out").click();
        cy.login({ username: "someone", password: "secret" });
        cy.contains("Some Title").contains("view").click();
        cy.contains("remove").click();
        cy.get("html").should("contain", "Some Title");
        cy.contains("Cannot delete this blog");
      });
      it.only("blog are ordered by number of likes", function () {
        cy.get(".blogs")
          .children()
          .each((blog) => {
            cy.wrap(blog).contains("view").click();
          })
          .then((blogs) => {
            expect(cy.wrap(blogs).first().contains("Other Title"));
            expect(cy.wrap(blogs).last().contains("Some Title"));
          });
      });
    });
  });
});
