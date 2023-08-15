import { Chance } from 'chance'
const chance = new Chance()

describe('tests for blog app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  it('checks the login', () => {
    const username = "alice1"
    const password = "12345"
    const email = "alice@prisma.io"

    cy.login(username, password)

    // check we have logged in
    cy.get("p").first().should("contain", email)
    cy.getCookie('BlogAppUserToken').should('exist')

  })
  it("checks the signup", () => {
    // cy.exec('npm run db:reset && npm run db:seed')
    const fullname = chance.string({ length: 2 })
    const username = chance.word()
    const password = "123456"
    const email = chance.email()
    cy.contains('Log in').click()
    cy.url().should('include', '/login')
    cy.get(".signup-link").click()
    cy.url().should('include', '/signup')
    cy.get('input[name=fullName]').type(fullname)
    cy.get('input[name=Username]').type(username)
    cy.get('input[name=Password]').type(password)
    cy.get('input[name=email]').type(email)
    cy.get('input[type=submit]').click()

    cy.login(username, password)

    // check we have logged in
    cy.get("p").first().should("contain", email)
    cy.getCookie('BlogAppUserToken').should('exist')

  })

  it('creates a post and publish it', () => {
    const username = "alice1"
    const password = "12345"
    const email = "alice@prisma.io"
    const title = chance.sentence({ words: 3 })

    cy.login(username, password)
    cy.get("p").first().should("contain", email)
    cy.getCookie('BlogAppUserToken').should('exist')

    // create a new post draft
    cy.visit("http://localhost:3000/create")
    cy.get("input[name=title]").type(title)
    cy.get("textarea").type("hello from cypress")
    cy.contains("Create").should("not.be.disabled").click()
    cy.wait(2000)
    cy.url().should('include', '/drafts')

    // publish the draft
    cy.contains(title).click()
    cy.url().should('include', '/p/')
    cy.contains("Publish").click()
    cy.wait(2000)
    cy.url().should('equal', "http://localhost:3000/")
    cy.contains('Public Feed')
    cy.contains(title)
  })

  it('tests login errors', () => {
    const username = "alice1"
    const password = chance.string({ length: 5 })

    cy.visit('http://localhost:3000/login')
    cy.get('input[type=submit]').click()
    cy.contains('All field are required')

    cy.get('input[name=Username]').type(username)
    cy.get('input[name=Password]').type(password)
    cy.get('input[type=submit]').click()
    cy.contains('Invalid username or password')
  })

  it('checks the profile', () => {
    const username = "alice1"
    const password = '12345'

    cy.login(username, password)
    cy.contains('Profile').click()
    cy.url().should('include', `/profile/${username}`)
  })



})