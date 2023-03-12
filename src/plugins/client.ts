class BaseClient {
  constructor(private baseURL: string = '') {}

  async request(method: string, url: string, body?: object) {
    const req = this.constructReq(method, url, body)
    return await fetch(req)
  }

  constructReq(method: string, url: string, body?: object) {
    const req: RequestInit = { method: method }
    req.headers = new Headers()
    req.headers.set('Content-Type', 'application/json')
    const token = window.localStorage.getItem('token')
    if (token) {
      req.headers.set('Authorization', `Bearer ${token}`)
    }
    if (method === 'POST') {
      req.headers.set(
        'Prefer',
        'return=representation,resolution=merge-duplicates'
      )
    }
    if (body) {
      req.body = JSON.stringify(body)
    }
    if (url.startsWith('http')) {
      return new Request(url, req)
    } else {
      url = this.baseURL + url
      return new Request(url, req)
    }
  }

  async get(url: string) {
    return await this.request('GET', url)
  }

  async post(url: string, body?: object) {
    return await this.request('POST', url, body)
  }

  async put(url: string, body?: object) {
    return await this.request('PUT', url, body)
  }

  async patch(url: string, body?: object) {
    return await this.request('PATCH', url, body)
  }

  async del(url: string, body?: object) {
    return await this.request('DELETE', url, body)
  }
}

class Client extends BaseClient {
  constructor(baseURL: string = '') {
    super(baseURL)
  }

  async request(method: string, url: string, body?: object) {
    if (!window.localStorage.getItem('token')) {
      auth.login()
      throw new Error('Unauthenticated')
    }
    const r = await super.request(method, url, body)
    if (r.status === 401) {
      auth.login()
      throw new Error('Token Invalid')
    }
    return r
  }
}

export const client = new Client('/api')

class Auth extends BaseClient {
  constructor(
    private endpoint: string,
    private clientID: string,
    private clientSecret: string
  ) {
    super(endpoint)
  }

  login() {
    const uri = window.location.href.replace(window.location.origin, '')
    window.location.href =
      `${this.endpoint}/login/oauth/authorize?` +
      new URLSearchParams({
        client_id: this.clientID,
        redirect_uri: `${window.location.origin}/callback?redirect=${uri}`,
        response_type: 'code',
        scope: 'read',
        state: 'casdoor',
      })
  }

  async getToken(code: string) {
    const r = await this.post(
      '/api/login/oauth/access_token?' +
        new URLSearchParams({
          client_id: this.clientID,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code: code,
        })
    )
    const res = await r.json()
    return res.access_token
  }
}

export const auth = new Auth(
  'https://auth.x.hath.top:8443',
  'f6e07df856cace211672',
  '50869bec0a2a2ae3c3f5c9457e288fac14fe2404'
)
