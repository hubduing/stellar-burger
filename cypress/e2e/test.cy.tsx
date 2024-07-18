/// <reference types="cypress" />
import user from '../fixtures/user.json';

describe('Cypress Tests', () => {
  // Этот блок выполняется перед каждым тестом
  beforeEach(() => {
    // Переход на главную страницу
    cy.visit('http://localhost:4000/');
    // Перехват запроса на получение ингредиентов и замена ответа фикстурой
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
  });

  describe('Тест добавления ингредиентов', () => {
    it('должен добавить в ингредиенты булку', () => {
      // Нажатие на кнопку добавления булки
      cy.get('[data-cy="Краторная булка N-200i"]')
        .find('button')
        .click({ force: true });
      // Проверка, что булка добавлена в конструктор
      cy.get(
        '.constructor-element > .constructor-element__row > .constructor-element__text'
      ).should('contain', 'Краторная булка N-200i');
      // Проверка, что счетчик ингредиентов увеличился
      cy.get('.counter__num').should('contain', '2');
    });

    it('должен добавить в ингредиенты котлету', () => {
      // Нажатие на кнопку добавления котлеты
      cy.get('[data-cy="Биокотлета из марсианской Магнолии"]')
        .children('button')
        .click({ force: true });
      // Проверка, что котлета добавлена в конструктор
      cy.get('.constructor-element__row').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
      // Проверка, что счетчик ингредиентов увеличился
      cy.get('.counter__num').should('contain', '1');
    });

    it('должен добавить в ингредиенты соус', () => {
      // Нажатие на кнопку добавления соуса
      cy.get('[data-cy="Соус фирменный Space Sauce"]')
        .children('button')
        .click({ force: true });
      // Проверка, что соус добавлен в конструктор
      cy.get('.constructor-element__row').should(
        'contain',
        'Соус фирменный Space Sauce'
      );
      // Проверка, что счетчик ингредиентов увеличился
      cy.get('.counter__num').should('contain', '1');
    });
  });
  describe('Тест модальных окон ингредиентов', () => {
    it('должен корректно отобразить данные ингредиента в открытом модальном окне', () => {
      // Открытие модального окна с данными ингредиента
      cy.get('[data-cy="Краторная булка N-200i"]').click();
      // Проверка, что модальное окно содержит корректные данные
      cy.get('[data-cy="modalContent"]').should(
        'contain.text',
        'Краторная булка N-200i'
      );
      cy.get('[data-cy="modalContent"]').should('contain.text', 'Калории');
      cy.get('[data-cy="modalContent"]').should('contain.text', '420');
    });

    it('должен закрыть модальное окно по кнопке', () => {
      // Открытие модального окна с данными ингредиента
      cy.get('[data-cy="Биокотлета из марсианской Магнолии"]').click();
      // Закрытие модального окна по кнопке
      cy.get('#modals').find('button').click({ force: true });
    });
    it('должен закрыть модальное окно кликом по оверлей', () => {
      // Открытие модального окна с данными ингредиента
      cy.get('[data-cy="Краторная булка N-200i"]').click();
      // Закрытие модального окна кликом по оверлей
      cy.get('[data-cy="modalOverlay"]').click({ force: true });
    });
  });

  describe('Тест заказа', () => {
    // Этот блок выполняется перед каждым тестом в этом разделе
    beforeEach(() => {
      // Установка куки и локального хранилища для авторизации
      cy.setCookie('accessToken', 'accessToken');
      localStorage.setItem('refreshToken', 'refreshToken');
      cy.visit('http://localhost:4000/');
      // Перехват запроса на получение данных пользователя и замена ответа фикстурой
      cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
    });

    it('должен проверить авторизацию', () => {
      // Переход на страницу профиля
      cy.get('a[href="/profile"]').click();
      // Проверка, что поля формы содержат данные пользователя
      cy.get(
        ':nth-child(1) > .input__container > .input > .input__textfield'
      ).should('contain.value', user.user.name);
      cy.get(
        ':nth-child(2) > .input__container > .input > .input__textfield'
      ).should('contain.value', user.user.email);
    });

    it('должен произойти заказ', () => {
      cy.visit('http://localhost:4000/');
      // Перехват запроса на создание заказа и замена ответа фикстурой
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
        'orderRequest'
      );
      // Добавление ингредиентов в заказ
      cy.get('[data-cy="Флюоресцентная булка R2-D3"]')
        .children('button')
        .click({ force: true });
      cy.get('[data-cy="Филе Люминесцентного тетраодонтимформа"]')
        .children('button')
        .click({ force: true });
      // Оформление заказа
      cy.get('.button').contains('Оформить заказ').click();
      // Ожидание завершения запроса на создание заказа
      cy.wait('@orderRequest');
      // Проверка, что заказ успешно создан
      cy.get('#modals').contains('56789');
      // Закрытие модального окна
      cy.get('#modals').find('button').click();
    });

    // Этот блок выполняется после каждого теста в этом разделе
    afterEach(() => {
      // Очистка куки и локального хранилища
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  });
});
