var request = require('request');

module.exports = function(context, cb) {
  var body, url, title;

  var show_emails = JSON.parse(context.secrets.show_emails);
  if (show_emails.indexOf(context.body.commit.author_email) == -1) return;
  
  if (context.body.event == "build") {
    body = "A build is tested and " + context.body.result + ". (Branch: " + context.body.branch_name + ")";
    url = context.body.build_url;
    title = "Build";
  }
  else if (context.body.event == "deploy") {
    body = "A build is deployed. Result: " + context.body.result;
    url = context.body.html_url;
    title = "Deploy";
  }
  request(
    { 
      method: 'POST',
      headers: {
        "Access-Token": context.secrets.pushbullet_token,
        "content-type": "application/json"
      },
      uri: 'https://api.pushbullet.com/v2/pushes',
      json: {
        "type": "link",
        "title": title,
        "body": body,
        "url": url
      }
    }
  );
  cb(null, null);
};
