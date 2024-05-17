describe('Project Management Application', () => {

  it('Visits the initial project page', () => {
    cy.visit('http://localhost:4201/');
    cy.contains('Projetos').should('be.visible');
  });

  it('Should add a project and increase table size by 1', () => {
    cy.visit('http://localhost:4201/');
    // Conta o número de linhas na tabela antes de adicionar um projeto
    cy.get('table tbody tr').its('length').then((initialRowCount) => {

      
    // Adiciona novo projeto
      cy.contains('Create Project').click();
      const randomNum = Math.floor(Math.random() * 10000);
      const projeto = 'Projeto' + randomNum;
      cy.wrap(projeto).as('newProjectName'); // Armazena o nome do projeto como alias

      cy.get('input[name="Name"]').type(projeto);
      //clicar no filtro por id
      cy.get('input[name="startDate"]').type('2025-05-01');
      cy.get('input[name="endDate"]').type('2025-05-31');
      cy.get('form').submit();
      cy.wait(500); // Aguarde o projeto ser adicionado
      cy.contains('td', projeto).should('exist');
      // Verifica se o número de linhas na tabela aumentou em 1
      cy.get('table tbody tr').should('have.length', initialRowCount + 1);
    });
  });

  /*it('Creates a new project and verifies count via filtering', () => {
    cy.visit('http://localhost:4201/');
    // Adiciona novo projeto
    cy.contains('Create Project').click();
    const randomNum = Math.floor(Math.random() * 10000);
    const projeto = 'Projeto' + randomNum;
    cy.wrap(projeto).as('newProjectName'); // Armazena o nome do projeto como alias

    cy.get('input[name="Name"]').type(projeto);
    cy.get('input[name="startDate"]').type('2025-05-01');
    cy.get('input[name="endDate"]').type('2025-05-31');
    cy.get('form').submit();
    cy.wait(500); // Aguarde o projeto ser adicionado

    // Verifica se o projeto criado está na lista usando filtro
    cy.get('input[placeholder="Filter"]').clear().type(projeto);
    cy.wait(500); // Aguarde o filtro ocorrer
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').contains(projeto).parent().contains('Details').click();
    cy.wait(500); // Aguarde os detalhes do projeto aparecerem
    
  });

  it('Adds a new collaborator to the new project and verifies count via filtering', () => {
    cy.get('@newProjectName').then((projectName) => {
      

      // Adiciona colaborador
      cy.contains('Add Colaborator').click();
      const randomColabNum = Math.floor(Math.random() * 10000);
      const colaboradorId = randomColabNum.toString();
      cy.wrap(colaboradorId).as('newColabId'); // Armazena o ID do colaborador como alias

      cy.get('select[name="colaboratorId"]').select('1');
      cy.get('input[name="DataInicio"]').type('2025-05-01');
      cy.get('input[name="DataFim"]').type('2025-05-31');
      cy.get('form').submit();
      cy.wait(500); // Aguarde a associação ser adicionada

      // Verifica se o colaborador criado está na lista usando filtro
      cy.get('input[placeholder="Filter Colaborators"]').clear().type(colaboradorId);
      cy.wait(500); // Aguarde o filtro ocorrer
      cy.get('.project-details tbody tr').should('have.length', 1);
      cy.get('.project-details tbody tr').contains(colaboradorId);
    });
  });*/

  
});
