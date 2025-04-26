const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET = 'chave-super-secreta'; // Em produção, use variáveis de ambiente

// Simulação de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Exemplo: login fixo
  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload.user;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// Rota protegida
app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user}!` });
});

// Configuração do servidor para rodar na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
