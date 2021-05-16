function createElm(tag, objectCl) {
  const elem = document.createElement(tag);
  for (const key of Object.keys(objectCl)) {
    elem[key] = objectCl[key];
  }
  return elem;
}

function topSections(userData) {
  const headerSec = headerSection(userData);
  container.append(headerSec);
}
function bottomSection(postData, users) {
  console.log("bottom section users", users);
  const feedSec = feedSection(postData, users);
  const createPost = createPostSection(feedSec);
  mainSection.append(createPost, feedSec);
  container.append(mainSection);
}

function userProfile(userData, wrapperEl) {
  const chipEl = createElm("div", { className: "chip" });
  const avatarEl = createElm("div", { className: "avatar-small" });
  const imgEl = createElm("img", {
    src: userData.avatar,
    alt: userData.username,
  });

  const spanEl = createElm("span", { innerText: userData.username });
  avatarEl.append(imgEl);
  chipEl.append(avatarEl, spanEl);
  wrapperEl.append(chipEl);
  return wrapperEl;
}

function headerSection(userData) {
  const headerEl = createElm("header", { className: "main-header" });
  const wrapperEl = createElm("wrapper", { className: "wrapper" });
  for (const user of userData) {
    userProfile(user, wrapperEl);
  }

  headerEl.append(wrapperEl);

  return headerEl;
}

function createPostSection(postAdd) {
  const postSection = createElm("section", {
    className: "create-post-section",
  });
  const formEl = createElm("form", {
    id: "create-post-form",
    autocomplete: "off",
  });
  const h2El = createElm("h2", { innerText: "Create a post" });
  const labelElImage = createElm("label", { for: "image", innerText: "Image" });
  const inputImage = createElm("input", {
    id: "image",
    name: "image",
    type: "text",
  });
  const labelElTitle = createElm("label", { for: "title", innerText: "Title" });
  const inputTitle = createElm("input", {
    id: "title",
    name: "title",
    type: "text",
  });
  const labelElContent = createElm("label", {
    for: "content",
    innerText: "Content",
  });
  const textAreaEL = createElm("textarea", {
    id: "content",
    name: "content",
    rows: "2",
    columns: "30",
  });

  const divEl = createElm("div", { className: "acttion-btns" });
  const buttonPreview = createElm("button", {
    id: "preview-btn",
    type: "button",
    innerText: "Preview",
  });
  const buttonSubmit = createElm("button", {
    type: "submit",
    innerText: "Post",
  });

  formEl.addEventListener("submit", function (event) {
    event.preventDefault();

    const post = {
      title: inputTitle.value,
      image: inputImage.value,
      content: textAreaEL.value,
    };
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (newPost) {
        userPosts(newPost, postAdd);
      });
    formEl.reset();
  });

  divEl.append(buttonPreview, buttonSubmit);
  formEl.append(
    h2El,
    labelElImage,
    inputImage,
    labelElTitle,
    inputTitle,
    labelElContent,
    textAreaEL,
    divEl
  );
  postSection.append(formEl);
  return postSection;
}

function userPosts(post, ulEl, postUser) {
  const liEl = createElm("li", { className: "post" });
  const chipEl = createElm("div", { className: "chip" });
  const avatarEl = createElm("div", { className: "avatar-small" });
  const imgEl = createElm("img", {
    src: postUser.avatar,
    alt: postUser.username,
  });
  const spanEl = createElm("span", { innerText: postUser.username });
  const postImageEl = createElm("div", { className: "post--image" });
  const imagePostEl = createElm("img", {
    src: post.image.src,
    alt: "undefined",
    width: 288,
  });
  const postContent = createElm("div", { className: "post--content" });
  const h2El = createElm("h2", { innerText: post.title });
  const pEl = createElm("p", {
    innerText: post.content,
  });
  const commentsEl = createElm("div", { className: "post--comments" });
  const h3El = createElm("h3", { innerText: "Comments" });
  const formEl = createElm("form", {
    id: "create-comment-form",
    autocomplete: "off",
  });
  const labelEl = createElm("label", {
    for: "comment",
    innerText: "Add Comment",
  });
  const inputEl = createElm("input", {
    id: "comment",
    name: "comment",
    type: "text",
  });
  const buttonSubmit = createElm("button", {
    type: "submit",
    innerText: "Comment",
  });
  const postComment = createElm("div", { className: "post--comment" });

  for (const comment of post.comments) {
    commentsSec(comment, commentsEl);
  }

  formEl.append(labelEl, inputEl, buttonSubmit);
  postImageEl.append(imagePostEl);
  commentsEl.append(h3El, formEl);
  postContent.append(h2El, pEl);
  avatarEl.append(imgEl);
  chipEl.append(avatarEl, spanEl);
  liEl.append(chipEl, postImageEl, postContent, commentsEl);
  ulEl.append(liEl);
}
function commentsSec(comment, commentsEl) {
  const avatarSmall = createElm("div", { className: "avatar-small" });
  const smallImgEl = createElm("img", {
    src: comment.userId,
    alt: "Van Gogh",
  });
  const postComment = createElm("div", { className: "post--comment" });
  const pEl2 = createElm("p", { innerText: comment.content });
  avatarSmall.append(smallImgEl);
  postComment.append(avatarSmall, pEl2);
  commentsEl.append(postComment);
}

function feedSection(postData, users) {
  console.log("feed section users", users);
  const sectionEl = createElm("section", { className: "feed" });
  const ulEl = createElm("ul", { className: "stack" });
  for (const post of postData) {
    let postUser = users.find(function (user) {
      return user.id === post.userId;
    });
    console.log("After find user", postUser);
    userPosts(post, ulEl, postUser);
  }
  sectionEl.append(ulEl);
  return sectionEl;
}

function getUser() {
  let users = {};
  fetch("http://localhost:3000/users")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      users = data;
      fetch("http://localhost:3000/posts")
        .then(function (response) {
          return response.json();
        })
        .then(function (userPosts) {
          topSections(users);
          bottomSection(userPosts, users);
          console.log("After fetch", users);
        });
    });
}

// function getPost() {
//   fetch("http://localhost:3000/posts")
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (userPosts) {
//       bottomSection(userPosts);
//     });
// }

getUser();
// getPost();

const container = document.querySelector("#root");

const mainSection = createElm("main", { className: "wrapper" });
