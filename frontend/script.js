console.log('Frontend carregado!');

// Função para buscar usuários do backend
function buscarUsuarios() {
  fetch('http://localhost:3000/usuarios')
    .then(response => response.json())
    .then(usuarios => {
      const lista = document.getElementById('lista-usuarios');
      lista.innerHTML = ''; // Limpar lista antes de adicionar novos itens

      usuarios.forEach(usuario => {
        const item = document.createElement('li');
        item.textContent = `${usuario.nome} (${usuario.email})`;
        lista.appendChild(item);
      });
    })
    .catch(error => console.error('Erro ao buscar usuários:', error));
}

// Função para adicionar um novo usuário
function adicionarUsuario(event) {
  event.preventDefault(); // Evitar o recarregamento da página

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  // Enviar o novo usuário para o backend
  fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, email })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Usuário criado:', data);
      buscarUsuarios(); // Atualizar a lista de usuários
    })
    .catch(error => {
      console.error('Erro ao criar usuário:', error);
    });
}

// Chamar a função para buscar usuários ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  buscarUsuarios();
});

// Lidar com o envio do formulário de criação de usuário
const form = document.getElementById('form-usuario');
if (form) {
  form.addEventListener('submit', adicionarUsuario);
}
