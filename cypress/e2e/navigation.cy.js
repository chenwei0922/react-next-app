/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

// 测试页面导航
describe('页面导航', () => {
  it('应该能成功从首页导航到关于页面', () => {
    // 从首页开始
    cy.visit('/')

    // 找到 About 页面的链接并点击
    cy.get('a[href*="about"]').click()

    // 新 URL 应包含 "/about"
    cy.url().should('include', '/about')

    // 新页面应包含 "About" 标题
    cy.get('h1').contains('About')
  })
})