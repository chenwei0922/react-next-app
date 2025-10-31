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

// 测试api拦截与模拟
// 
// 这是一个客户端组件，它会在渲染时获取数据
// 'use client';

// import { useEffect, useState } from 'react';

// export default function UserDashboard() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch('/api/users')
//       .then(res => res.json())
//       .then(setUsers);
//   }, []);

//   return (
//     <ul>
//       {users.map(user => <li key={user.id}>{user.name}</li>)}
//     </ul>
//   );
// }

describe('用户列表', () => {
  it('应显示获取到的用户列表', () => {
    //1. 拦截对 /api/users 的请求，并模拟响应数据
    // cy.intercept('GET', '/api/users', {
    //   statusCode: 200,
    //   body: [
    //     { id: 1, name: 'Alice' },
    //     { id: 2, name: 'Bob' },
    //   ],
    // }).as('getUsers')
    // 或者使用json文件作为响应
    cy.intercept('GET', '**/xgc/v1/work/list**', { fixture: 'mockUsers.json' }).as('getUsers')
    
    //2. 访问用户列表页面,// 触发请求的操作，例如点击按钮或访问页面
    cy.visit('/list') // 假设 UserDashboard 组件在 /about 页面上
    // cy.get('button#load-users').click() // 假设有一个按钮触发用户加载
    // cy.get('[data-testid]="load-users"').click() // 假设有一个按钮触发用户加载
    
    //3. 等待拦截的请求完成
    cy.wait('@getUsers').then((interception) => {
      console.log('捕获到的请求:', interception.request.url);
    })

    //4. 断言页面上显示了模拟的用户数据
    cy.get('[data-testid="list-item"]').should('have.length', 10)
    // cy.get('li').first().should('contain.text', 'Alice')
    // cy.get('li').last().should('contain.text', 'Bob')
  })
})