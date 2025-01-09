import axios from "axios";


export async function refreshTokens(twitterCredentials: any) {
    const {data} = await axios.post('https://api.twitter.com/2/oauth2/token', {
        refresh_token: twitterCredentials.refreshToken,
        grant_type: 'refresh_token'
    }, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${twitterCredentials.key}:${twitterCredentials.secret}`)}`
        }
    })
    return data
}
