//1 basic example



//2 slightly more complex example

function sendRequest(url) {
  return fetch(url)
}

async function apiCall() {
  let response = await sendRequest('http://example.com')
  let status = response.status
  if (status >= 200 || status <= 299) {
    console.log('great success')
    return
  }  
  if (status >= 400 || status <= 599) {
    console.log('crowd groan')
    return
  }
  if (status === 0) {
    console.log('failure to launch')
  }
}

sendRequest('http://example.shom').then(message => console.log('great success')).catch(message => console.log('giant failure'))



//3 another complexish example


//4 The following won't work

async function apiCall() {
  let request = new XMLHttpRequest()
  request.open('GET', 'http://example.com')
  request.send()
  let response = await request
  if (response >= 200 && response <= 299) {
    console.log('great success')
  } else {
    console.log('*crowd groan*', response.status)
  }
}