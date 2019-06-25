const { describe, beforeEach, afterEach, it } = require('mocha')
const { By, promise } = require('selenium-webdriver')
let expect = require('chai').expect
let webdriver = require('selenium-webdriver')

promise.USE_PROMISE_MANAGER = false

let username = process.env.SAUCE_USERNAME
let accessKey = process.env.SAUCE_ACCESS_KEY

// Change the baseURL to your application URL
let baseUrl = 'https://www.saucedemo.com'
let tags = ['sauceDemo', 'async', 'node', 'webdriverjs']
let driver

describe('async/await tests', function () {
  this.timeout(40000)
  beforeEach(async function () {
    driver = await new webdriver.Builder().withCapabilities({
      'browserName': 'chrome',
      'platformName': 'Windows 10',
      'browserVersion': 'latest',
      'goog:chromeOptions': { 'w3c': true },
      'sauce:options': {
        'username': username,
        'accessKey': accessKey,
        'seleniumVersion': '3.141.59',
        'build': 'JS-Async/Await-Tests',
        'name': 'js-async/await: ' + this.currentTest.title,
        'maxDuration': 3600,
        'idleTimeout': 1000,
        'tags': tags
      }
    })
      .usingServer('https://ondemand.saucelabs.com/wd/hub')
      .build()

    await driver.getSession().then(function (sessionid) {
      driver.sessionID = sessionid.id_
    })
  })

  afterEach(async function () {
    await driver.executeScript('sauce:job-result=' + (this.currentTest.state))
    await driver.quit()
  })

  it('get-title-test', async function () {
    await driver.get(baseUrl)
    const title = await driver.getTitle()
    console.log('Page Title is: ' + title)
    expect(title).equals('Swag Labs')
  })

  it('login-test', async function () {
    await driver.get(baseUrl)
    await driver.findElement(By.id('user-name')).sendKeys('standard_user')
    await driver.findElement(By.id('password')).sendKeys('secret_sauce')
    await driver.findElement(By.className('btn_action')).click()
    const currentURL = await driver.getCurrentUrl()
    console.log('URL is:  ' + currentURL)
    expect(currentURL).equals('https://www.saucedemo.com/inventory.html')
  })
})
