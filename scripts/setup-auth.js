const fs = require('fs');
const http = require('http');
const url = require('url');
const { google } = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';
const PORT = 3001;

fs.readFile(CREDENTIALS_PATH, (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content));
});

function authorize(credentials) {
  const { client_secret, client_id } = credentials.installed || credentials.web;
  
  if (!client_secret || !client_id) {
    console.log("Invalid credentials.json format. Ensure you downloaded the Desktop or Web OAuth Client JSON.");
    return;
  }

  const redirectUri = `http://localhost:${PORT}/oauth2callback`;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client);
    console.log('token.json already exists! You are good to go.');
  });
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent' // Forces refresh token
  });

  console.log('=============================================');
  console.log('1. Click the link below to authorize the app:');
  console.log(authUrl);
  console.log('=============================================');

  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/oauth2callback')) {
      const qs = new url.URL(req.url, `http://localhost:${PORT}`).searchParams;
      const code = qs.get('code');
      const error = qs.get('error');

      if (error) {
        res.end(`Error during authentication: ${error}`);
        console.error('Error during authentication:', error);
        server.close();
        process.exit(1);
      }

      res.end('Authentication successful! You can close this tab and return to the terminal.');
      server.close();
      
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        
        fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2), (err) => {
          if (err) return console.error(err);
          console.log('\n✅ Token stored successfully to', TOKEN_PATH);
          console.log('You can now use the Sheets & Drive API.');
          process.exit(0);
        });
      });
    }
  }).listen(PORT, () => {
    console.log(`\nLocal server listening on http://localhost:${PORT}... waiting for your browser to redirect.`);
  });
}
