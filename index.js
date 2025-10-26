
import express from 'express';


const app = express();
const port = 3000;
const host ="0.0.0.0";



app.get('/', (req, res) => {
  const { idade, sexo, salarioBase, anoContratacao, matricula } = req.query;

  if (!idade || !sexo || !salarioBase || !anoContratacao || !matricula) {
    return res.send(`
      <h2>Sistema de Reajuste Salarial</h2>
      <p>Digite os dados na URL igual ao exemplo abaixo:</p>
      <p><b>Exemplo:</b> http://localhost:3000/?idade=18&sexo=M&salarioBase=2000&anoContratacao=2018&matricula=1234</p>
      <p>Após digitar, o servidor calculará o reajuste salarial e exibirá o resultado.</p>
    `);
  }

  const idadeNum = parseInt(idade, 10);
  const salarioNum = parseFloat(salarioBase.replace(',', '.'));
  const anoNum = parseInt(anoContratacao, 10);
  const matriculaNum = parseInt(matricula, 10);
  const anoAtual = new Date().getFullYear();
  const tempoEmpresa = anoAtual - anoNum;

  if (Number.isNaN(idadeNum) || Number.isNaN(salarioNum) || Number.isNaN(anoNum) || Number.isNaN(matriculaNum)) {
    return res.send("<h3>Dados inválidos: algum parâmetro não é numérico. Verifique e tente novamente.</h3>");
  }

  if (idadeNum < 16) {
    return res.send("<h3>Idade inválida! Deve ser maior que 16 anos.</h3>");
  }
  if (anoNum <= 1960) {
    return res.send("<h3>Ano de contratação inválido! Deve ser maior ou igual que 1960.</h3>");
  }
  if (salarioNum <= 0) {
    return res.send("<h3>Salário base tem que ser maior que zero.</h3>");
  }
  if (matriculaNum <= 0) {
    return res.send("<h3>Matrícula deve ser um número maior que zero.</h3>");
  }

  const sexoUpper = String(sexo).toUpperCase();
  if (sexoUpper !== 'M' && sexoUpper !== 'F') {
    return res.send("<h3>Sexo inválido! use 'M' ou 'F'.</h3>");
  }

  let reajuste = 0;
  let desconto = 0;
  let acrescimo = 0;

  if (idadeNum >= 18 && idadeNum <= 39) {
    reajuste = sexoUpper === 'M' ? 10 : 8;
    desconto  = sexoUpper === 'M' ? 10 : 11;
    acrescimo = sexoUpper === 'M' ? 17 : 16;
  } else if (idadeNum >= 40 && idadeNum <= 69) {
    reajuste = sexoUpper === 'M' ? 8 : 10;
    desconto  = sexoUpper === 'M' ? 5 : 7;
    acrescimo = sexoUpper === 'M' ? 15 : 14;
  } else if (idadeNum >= 70 && idadeNum <= 99) {
    reajuste = sexoUpper === 'M' ? 15 : 17;
    desconto  = sexoUpper === 'M' ? 15 : 17;
    acrescimo = sexoUpper === 'M' ? 13 : 12;
  } else {
    return res.send("<h3>Idade inválida! (18-99 anos).</h3>");
  }

  let salarioReajustado = salarioNum + (salarioNum * (reajuste / 100));
  salarioReajustado += (tempoEmpresa > 10 ? acrescimo : -desconto);

  res.send(`
    <h2>Resultado do Reajuste Salarial</h2>
    <p><b>Matrícula:</b> ${matriculaNum}</p>
    <p><b>Sexo:</b> ${sexoUpper}</p>
    <p><b>Idade:</b> ${idadeNum}</p>
    <p><b>Salário Base:</b> R$ ${salarioNum.toFixed(2)}</p>
    <p><b>Ano de Contratação:</b> ${anoNum}</p>
    <p><b>Tempo de Empresa:</b> ${tempoEmpresa} anos</p>
    <p><b>Reajuste:</b> ${reajuste}%</p>
    <p><b>Desconto:</b> R$ ${desconto.toFixed(2)}</p>
    <p><b>Acréscimo:</b> R$ ${acrescimo.toFixed(2)}</p>
    <h3>Salário Reajustado: R$ ${salarioReajustado.toFixed(2)}</h3>
  `);
});


app.listen(port, host, () => console.log(`Servidor rodando em http://${host}:${port}`));
