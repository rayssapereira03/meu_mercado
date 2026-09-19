let produtos = JSON.parse(localStorage.getItem('meu_mercado_produtos')) || [];
let instaciasTabs;

document.addEventListener('DOMContentLoaded', function() {
  const elemsTabs = document.querySelectorAll('.tabs');
  instaciasTabs = M.Tabs.init(elemsTabs);

  const elemsSelect = document.querySelectorAll('select');
  M.FormSelect.init(elemsSelect);

  atualizarInterface();

  document.getElementById('form-produto').addEventListener('submit', adicionarProduto);
});

function navegarPara(idAba) {
  instaciasTabs[0].select(idAba);
}

function adicionarProduto(e) {
  e.preventDefault();

  const nome = document.getElementById('nome_produto').value;
  const preco = parseFloat(document.getElementById('preco_produto').value);
  const qtd = parseInt(document.getElementById('qtd_produto').value);
  const categoria = document.getElementById('categoria_produto').value || 'Outros';

  const novoProduto = {
    id: Date.now(),
    nome,
    preco,
    qtd,
    categoria,
    total: preco * qtd
  };

  produtos.push(novoProduto);
  salvarEAtualizar();

  document.getElementById('form-produto').reset();
  M.FormSelect.init(document.querySelectorAll('select'));

  M.toast({html: 'Produto adicionado!', classes: 'green'});
  navegarPara('aba-lista');
}

function apagarProduto(id) {
  produtos = produtos.filter(p => p.id !== id);
  salvarEAtualizar();
  M.toast({html: 'Produto removido!', classes: 'orange'});
}

function limparTodaLista() {
  if (produtos.length === 0) return;

  if (confirm('Deseja apagar todos os produtos da lista?')) {
    produtos = [];
    salvarEAtualizar();
    M.toast({html: 'Lista limpa!', classes: 'red'});
  }
}

function salvarEAtualizar() {
  localStorage.setItem('meu_mercado_produtos', JSON.stringify(produtos));
  atualizarInterface();
}

function atualizarInterface() {
  const tabela = document.getElementById('tabela-produtos');
  tabela.innerHTML = '';

  let qtdTotal = 0;
  let valorTotalCompra = 0;

  produtos.forEach(p => {
    qtdTotal += p.qtd;
    valorTotalCompra += p.total;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.nome}</strong> <br><small class="grey-text">${p.categoria}</small></td>
      <td>${p.qtd}</td>
      <td>R$ ${p.preco.toFixed(2)}</td>
      <td><strong>R$ ${p.total.toFixed(2)}</strong></td>
      <td>
        <button onclick="apagarProduto(${p.id})" class="btn-floating btn-small waves-effect waves-light red">
          <i class="material-icons">delete</i>
        </button>
      </td>
    `;
    tabela.appendChild(tr);
  });

  document.getElementById('resumo-qtd').innerText = qtdTotal;
  document.getElementById('resumo-total').innerText = `R$ ${valorTotalCompra.toFixed(2)}`;
  document.getElementById('total-lista').innerText = `R$ ${valorTotalCompra.toFixed(2)}`;
}

// Registar o Service Worker para suporte PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker Registado com Sucesso!'))
    .catch(err => console.log('Erro no Service Worker:', err));
}