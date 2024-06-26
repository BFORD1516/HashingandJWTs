const API = "http://localhost:3000";

let username = localStorage.getItem("username");
let _token = localStorage.getItem("token");

if (_token) {
  showAuth();
} else {
  $("#need-auth").show();
}

function saveAuth(new_username, new_token) {
  username = new_username;
  _token = new_token;

  localStorage.setItem("username", username);
  localStorage.setItem("token", _token);
  showAuth();
}

function showAuth() {
  $("#need-auth").hide();
  $("#has-auth").show();
  $("#username").text(username);

  populateFrom();
  populateTo();
  populateUserDropDown();
}

$("#register-form").on("submit", async function (evt) {
  evt.preventDefault();

  const username = $("#register-username").val();
  const password = $("#register-password").val();
  const first_name = $("#register-fname").val();
  const last_name = $("#register-lname").val();
  const phone = $("#register-phone").val();

  let res = await $.ajax({
    url: `${API}/auth/register`,
    method: "POST",
    data: JSON.stringify({ username, password, first_name, last_name, phone }),
    contentType: "application/json",
    dataType: "json",
  });

  saveAuth(username, res.token);
});

$("#login-form").on("submit", async function (evt) {
  evt.preventDefault();

  const username = $("#login-username").val();
  const password = $("#login-password").val();

  let res = await $.post(`${API}/auth/login`, { username, password });
  saveAuth(username, res.token);
});

async function populateFrom() {
  const $msgsFrom = $("#msgs-from");
  $msgsFrom.empty();

  let res = await $.get(`${API}/users/${username}/from`, { _token });

  for (let m of res.messages) {
    let text = m.body + " - " + m.to_user.username;
    $msgsFrom.append($("<li>", { text: text }));
  }
}

async function populateTo() {
  const $msgsTo = $("#msgs-to");
  $msgsTo.empty();

  let res = await $.get(`${API}/users/${username}/to`, { _token });

  for (let m of res.messages) {
    let text = m.body + " - " + m.from_user.username;
    $msgsTo.append($("<li>", { text: text }));
  }
}

async function populateUserDropDown() {
  $("#newmsg-to").empty();

  let res = await $.get(`${API}/users`, { _token });

  for (let { username } of res.users) {
    $("#newmsg-to").append($("<option>", { text: username, value: username }));
  }
}

$("#new-message-form").on("submit", async function (evt) {
  evt.preventDefault();

  let to_username = $("#newmsg-to").val();
  let body = $("#newmsg-body").val();

  await $.post(`${API}/messages`, { to_username, body, _token });

  populateFrom();
  populateTo();

  $("#newmsg-to").val("");
  $("#newmsg-body").val("");
});

$("#logout").on("click", function (evt) {
  $("#need-auth").show();
  $("#has-auth").hide();
  _token = null;
  username = null;
  localStorage.removeItem("username");
  localStorage.removeItem("token");
});
