const request = require('supertest');
const app = require('./app');

describe('API com autenticação JWT', () => {
  let token;

  it('Deve retornar um token com login válido', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    token = res.body.token; // salvar token para o próximo teste
  });

  it('Deve recusar login com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'errado' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('Deve acessar rota protegida com token válido', async () => {
    const res = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('Bem-vindo');
  });

  it('Deve bloquear rota protegida sem token', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
