import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { prettyDOM } from "@testing-library/dom";
import Blog from "./Blog";
import BlogForm from "./blogForm";

describe("testing blog component", () => {
  test("blog renders title and author by default but not others", () => {
    const blog = {
      title: "ABC",
      author: "David",
      url: "david.com",
      likes: 10,
    };
    const component = render(<Blog blog={blog} />);
    const blogMenu = component.container.querySelector(".blog_menu");
    console.log(prettyDOM(blogMenu));
    expect(component.container.querySelector(".blog_menu")).toHaveTextContent(
      "ABC",
      "David"
    );
    expect(
      component.container.querySelector(".blog_menu")
    ).not.toHaveTextContent("david.com", 10);
    expect(component.container.querySelector(".blog_detail")).toBe(null);
  });
  test("blog renders other details when show button is clicked", () => {
    const blog = {
      user: {
        name: "Lin Htet Swe",
      },
      title: "ABC",
      author: "David",
      url: "david.com",
      likes: 10,
    };
    const component = render(<Blog blog={blog} />);
    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);
    expect(component.container.querySelector(".blog_detail")).not.toBe(null);
    expect(component.container).toHaveTextContent(
      "Lin Htet Swe",
      "ABC",
      "David",
      "david.com",
      10
    );
  });
  test("testing like button work", () => {
    const blog = {
      user: {
        name: "Lin Htet Swe",
      },
      title: "ABC",
      author: "David",
      url: "david.com",
      likes: 10,
    };
    const mockHandler = jest.fn();
    const component = render(<Blog blog={blog} likeBlog={mockHandler} />);
    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);
    const likeButton = component.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
describe("test blog form", () => {
  test("blogform calls the event handler with right details", () => {
    const createBlog = jest.fn();
    const component = render(<BlogForm add={createBlog} />);
    const form = component.container.querySelector("form");
    const title = component.container.querySelector("#title");
    const author = component.container.querySelector("#author");
    const url = component.container.querySelector("#url");
    fireEvent.change(title, {
      target: { value: "ABC" },
    });
    fireEvent.change(author, {
      target: { value: "David" },
    });
    fireEvent.change(url, {
      target: { value: "david.com" },
    });
    fireEvent.submit(form);
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]["title"]).toBe("ABC");
    expect(createBlog.mock.calls[0][0]["author"]).toBe("David");
    expect(createBlog.mock.calls[0][0]["url"]).toBe("david.com");
  });
});
