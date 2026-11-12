(function () {
  'use strict'

  var STORAGE_KEY = 'fh-api-simulation-v1'
  var TOKENS = {
    tourist: '1|fh_demo_tourist_9f8e7d6c5b4a39281706',
    partner: '2|fh_demo_partner_4c3b2a1908f7e6d5c4b3',
    admin: '3|fh_demo_admin_7a6b5c4d3e2f1908a7b6',
  }
  var VALID_ROLES = Object.keys(TOKENS)
  var VALID_SCENARIOS = [
    'positif',
    'negatif-validasi',
    'negatif-autentikasi',
    'negatif-otorisasi',
    'negatif-tidak-ditemukan',
    'negatif-konflik',
    'negatif-rate-limit',
    'negatif-upstream',
    'negatif-server',
  ]

  function readState() {
    try {
      var parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      return {
        role: VALID_ROLES.indexOf(parsed.role) >= 0 ? parsed.role : 'tourist',
        scenario:
          VALID_SCENARIOS.indexOf(parsed.scenario) >= 0 ? parsed.scenario : 'positif',
      }
    } catch (error) {
      return { role: 'tourist', scenario: 'positif' }
    }
  }

  var state = readState()
  var requestCounter = 0
  var mockData = null
  var originalFetch = window.fetch.bind(window)

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      /* Penyimpanan lokal tidak tersedia, simulasi tetap berjalan. */
    }
  }

  function nextRequestId() {
    requestCounter += 1
    return 'req_mock_' + String(requestCounter).padStart(4, '0')
  }

  var fallbackErrors = {
    'negatif-validasi': {
      status: 422,
      code: 'VALIDATION_ERROR',
      message: 'Data yang dikirim belum lengkap atau formatnya belum benar.',
      details: [{ field: 'permintaan', message: 'Periksa kembali data yang dikirim.' }],
    },
    'negatif-autentikasi': {
      status: 401,
      code: 'UNAUTHENTICATED',
      message: 'Sesi tidak valid atau token tidak dikirim.',
    },
    'negatif-otorisasi': {
      status: 403,
      code: 'FORBIDDEN_ROLE',
      message: 'Peran aktif tidak memiliki akses ke endpoint ini.',
    },
    'negatif-tidak-ditemukan': {
      status: 404,
      code: 'NOT_FOUND',
      message: 'Data yang diminta tidak ditemukan.',
    },
    'negatif-konflik': {
      status: 409,
      code: 'CONFLICT',
      message: 'Permintaan bertentangan dengan data yang sudah ada.',
    },
    'negatif-rate-limit': {
      status: 429,
      code: 'RATE_LIMITED',
      message: 'Terlalu banyak permintaan. Coba lagi beberapa saat lagi.',
    },
    'negatif-upstream': {
      status: 503,
      code: 'UPSTREAM_UNAVAILABLE',
      message: 'Layanan pihak ketiga sedang tidak tersedia.',
    },
    'negatif-server': {
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'Terjadi kesalahan pada server.',
    },
  }

  var scenarioStatuses = {
    'negatif-validasi': [422, 400],
    'negatif-autentikasi': [401],
    'negatif-otorisasi': [403],
    'negatif-tidak-ditemukan': [404],
    'negatif-konflik': [409],
    'negatif-rate-limit': [429],
    'negatif-upstream': [503, 502, 504],
    'negatif-server': [500],
  }

  function normalizePath(pathname) {
    var marker = '/api/v1'
    var index = pathname.indexOf(marker)
    if (index < 0) return null
    var rest = pathname.slice(index + marker.length)
    if (!rest) return '/'
    if (rest.charAt(0) !== '/') rest = '/' + rest
    if (rest.length > 1 && rest.charAt(rest.length - 1) === '/') {
      rest = rest.slice(0, -1)
    }
    try {
      return decodeURIComponent(rest)
    } catch (error) {
      return rest
    }
  }

  function matchPath(template, actual) {
    var expected = template.split('/').filter(Boolean)
    var received = actual.split('/').filter(Boolean)
    if (expected.length !== received.length) return null
    var params = {}
    for (var index = 0; index < expected.length; index += 1) {
      var segment = expected[index]
      var value = received[index]
      if (segment.charAt(0) === '{' && segment.charAt(segment.length - 1) === '}') {
        params[segment.slice(1, -1)] = value
      } else if (segment !== value) {
        return null
      }
    }
    return params
  }

  function staticScore(path) {
    return path
      .split('/')
      .filter(Boolean)
      .filter(function (segment) {
        return segment.charAt(0) !== '{'
      }).length
  }

  function prepareRoutes(data) {
    return data.operations
      .map(function (operation) {
        return Object.assign({}, operation, {
          score: staticScore(operation.path),
        })
      })
      .sort(function (left, right) {
        if (right.score !== left.score) return right.score - left.score
        return right.path.length - left.path.length
      })
  }

  var routesPromise = originalFetch(new URL('./mock-data.json', window.location.href))
    .then(function (response) {
      if (!response.ok) throw new Error('Data simulasi tidak dapat dimuat.')
      return response.json()
    })
    .then(function (data) {
      data.routes = prepareRoutes(data)
      mockData = data
      return data
    })
    .catch(function (error) {
      mockData = { operations: [], routes: [], error: error.message }
      return mockData
    })

  function findOperation(method, path) {
    if (!mockData) return null
    for (var index = 0; index < mockData.routes.length; index += 1) {
      var operation = mockData.routes[index]
      if (operation.method !== method) continue
      var params = matchPath(operation.path, path)
      if (params) return { operation: operation, params: params }
    }
    return null
  }

  function pickError(operation) {
    var statuses = scenarioStatuses[state.scenario]
    if (!statuses) return null
    for (var i = 0; i < statuses.length; i++) {
      var targetStatus = statuses[i]
      var match = (operation.errors || []).find(function (error) {
        return error.status === targetStatus
      })
      if (match) return match
    }
    return fallbackErrors[state.scenario] || null
  }

  function errorBody(error) {
    var result = {
      error: {
        code: error.code,
        message: error.message,
      },
      request_id: nextRequestId(),
    }
    if (error.details && error.details.length) {
      result.error.details = error.details
    }
    return result
  }

  function successBody(operation) {
    if (operation.successByRole && operation.successByRole[state.role]) {
      return operation.successByRole[state.role]
    }
    return operation.success.body
  }

  function responseHeaders(operation, requestId) {
    return {
      'Content-Type': operation.success.contentType || 'application/json',
      'X-Request-Id': requestId,
      'X-Mock-Role': state.role,
      'X-Mock-Scenario': state.scenario,
      'X-Mock-Operation': operation.operationId,
      'Cache-Control': 'no-store',
    }
  }

  function wait(milliseconds) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, milliseconds)
    })
  }

  function errorResponse(operation, error) {
    var requestId = nextRequestId()
    var headers = responseHeaders(operation, requestId)
    headers['Content-Type'] = 'application/json'
    headers['X-Mock-Result'] = 'negatif'
    headers['X-Mock-Error'] = error.code
    var body = errorBody(error)
    body.request_id = requestId
    return new Response(JSON.stringify(body, null, 2), {
      status: error.status,
      headers: headers,
    })
  }

  function successResponse(operation) {
    var requestId = nextRequestId()
    var headers = responseHeaders(operation, requestId)
    headers['X-Mock-Result'] = 'positif'

    if (operation.success.status === 204) {
      delete headers['Content-Type']
      return new Response(null, {
        status: 204,
        headers: headers,
      })
    }

    var body = successBody(operation)
    if (operation.success.contentType === 'text/event-stream') {
      return new Response(String(body || ''), {
        status: operation.success.status,
        headers: headers,
      })
    }

    var payload =
      typeof body === 'string' ? body : JSON.stringify(body === undefined ? null : body, null, 2)
    return new Response(payload, {
      status: operation.success.status,
      headers: headers,
    })
  }

  async function handleApiRequest(input, init) {
    await routesPromise
    if (!mockData || mockData.error) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'MOCK_DATA_UNAVAILABLE',
            message:
              'Data simulasi tidak dapat dimuat. Jalankan halaman ini melalui server statis.',
          },
          request_id: nextRequestId(),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    var request = input instanceof Request ? input : null
    var rawUrl = request ? request.url : String(input)
    var url = new URL(rawUrl, window.location.href)
    var path = normalizePath(url.pathname)
    var method = String((init && init.method) || (request && request.method) || 'GET').toUpperCase()

    if (!path) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message: 'Endpoint simulasi tidak ditemukan.',
          },
          request_id: nextRequestId(),
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    var found = findOperation(method, path)
    if (!found) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NOT_FOUND',
            message:
              'Endpoint ' + method + ' ' + path + ' belum ada pada data simulasi.',
          },
          request_id: nextRequestId(),
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    await wait(120 + Math.floor(Math.random() * 120))

    var operation = found.operation
    var allowed =
      operation.roles.indexOf('public') >= 0 || operation.roles.indexOf(state.role) >= 0

    if (state.scenario !== 'positif') {
      var selectedError = pickError(operation)
      if (selectedError) return errorResponse(operation, selectedError)
    }

    if (!allowed) {
      return errorResponse(operation, {
        status: 403,
        code: 'FORBIDDEN_ROLE',
        message: 'Peran aktif tidak memiliki akses ke endpoint ini.',
      })
    }

    return successResponse(operation)
  }

  window.fetch = function (input, init) {
    var rawUrl = input instanceof Request ? input.url : String(input)
    var url
    try {
      url = new URL(rawUrl, window.location.href)
    } catch (error) {
      return originalFetch(input, init)
    }
    if (url.pathname.indexOf('/api/v1') < 0) {
      return originalFetch(input, init)
    }
    return handleApiRequest(input, init)
  }

  window.FHMock = {
    state: state,
    ready: routesPromise,
    getRole: function () {
      return state.role
    },
    getScenario: function () {
      return state.scenario
    },
    setRole: function (role) {
      if (VALID_ROLES.indexOf(role) < 0) return state.role
      state.role = role
      persist()
      return state.role
    },
    setScenario: function (scenario) {
      if (VALID_SCENARIOS.indexOf(scenario) < 0) return state.scenario
      state.scenario = scenario
      persist()
      return state.scenario
    },
    tokenFor: function (role) {
      return TOKENS[role] || TOKENS.tourist
    },
  }

  window.__FH_MOCK_READY__ = routesPromise
})()
