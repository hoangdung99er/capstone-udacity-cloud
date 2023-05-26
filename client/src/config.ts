// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'qzo6vo2yb6'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
export const esApiEndpoint = "https://search-todos-search-capstonee-dev-rllqsmu7ld77bo3hvthfnaukbq.us-east-1.es.amazonaws.com"
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-43k17h2z5hfhhzva.us.auth0.com',            // Auth0 domain
  clientId: 'KbXuQELCr4QPyC6G4L7seqq7u0WWjhAa',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
