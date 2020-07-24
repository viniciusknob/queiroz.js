# Queiroz.js 3.8.53
JavaScript Extension for Dimep Kairos

### Autor

* Vinícius M. Knob `<knob.vinicius@gmail.com>`

### Como utilizar

UserScript: [queiroz.user.js](../../raw/master/queiroz.user.js)

ou

Manualmente:
1. Após efetuar login, acesse um dos menus de apresentação dos horários: Ponto ou Pedidos;
2. Abra as Ferramentas do Desenvolvedor;
3. Copie, cole e execute o código contido [aqui](../../raw/master/dist/queiroz.min.js).

### Recursos

O único objetivo dessa extensão é calcular e apresentar dados facilitando a tomada de decisão do usuário. Os cálculos disponíveis atualmente são:

* Total de horas por turno, dia e semana;
* Saldo de horas por dia e semana;
* Previsão de saída por dia;
* Meta semanal.

OBS: Todos os cálculos são efetuados a partir da primeira Segunda-feira, isso é necessário para não bagunçar o resultado final, e também por que o script se limita, até o momento, ao que está sendo apresentado na view.

##### DayOff
No topo de cada coluna existe um "botão", semelhante a um checkbox. Esse recurso foi criado para possibilitar o On/Off de um dia, ou mais, simulando o funcionamento de um feriado e fazendo com que a extensão não considere em seus cálculos os dias que estiverem "desligados".

##### TimeOn
Informe o tempo de uma falta que será abonada pela Empresa. No menu de opções clique em "Abonar Falta" e insira o tempo total que será abonado no box que será apresentado. Ex.: Após uma consulta médica, o tempo contido no atestado é o tempo que será abonado e pode ser lançado com essa funcionalidade. OBS: Isso não altera o Kairos, serve apenas para fins de cálculos do Queiroz.

##### Notification
Ative as notificações para receber na área de trabalho avisos de aproximação dos seguintes horários:

* Tempo máximo de trabalho consecutivo, hoje 6 horas;
* Tempo máximo de trabalho por dia, hoje 10 horas;
* Meta Diária, conforme configurado pelo usuário;
* Meta Semanal, conforme resultado da soma de todas as metas diárias configuradas pelo usuário.

OBS: Para receber as notificações é necessário deixar a aba do Kairos aberta na página Ponto ou Pedidos.

##### MockTime
Kairos ainda não sincronizou os horários? Tudo bem, com o recurso MockTime você pode lançar manualmente o horário e depois, quando a sincronização executar, deletá-lo. Os horários lançados com MockTime não são lançados no Kairos, eles são armazenados no localStorage e sempre que carregar a página eles serão carregados também, até que você os delete.

MockTime também pode ser utilizado para simular lançamentos de horários. Isso quer dizer que, por exemplo, se você está viajando e pretende lançar os horários reais em outro momento, pode utilizar o MockTime para lançar os horários, evitando esquecê-los.

Queiroz irá considerar todo e qualquer MockTime em seus cálculos, como se fossem horários reais. Para isso, lance os horários em ordem de acontecimento, pois a funcionalidade não ordena os mesmos. Para remover, basta clicar no "x".

### Termos e Nomeclaturas

##### Turno
A diferença entre Entrada e Saída.

##### Saldo
Existem 2 tipos de saldo que são apresentados:
* Saldo do dia: Meta diária - Tempo de trabalho;
* Saldo Total: Soma de todos os saldos da semana.

OBS: O saldo do dia, no dia atual, sempre apresentará a meta diária + o saldo total, por esse motivo, na maioria das vezes será apresentado um valor negativo e alto no início do dia que irá diminuíndo ao longo do mesmo.

##### Previsão de Saída
Existem 2 tipos de previsão de saída que são apresentados:
* Saída (Meta): baseada na meta diária. Esse campo apresentará exatamente a hora de saída caso o usuário deseje completar a meta diária.
* Saída + Saldo: baseada na meta diária + saldo total. Esse campo mostrará a hora de saída ajustada.

### Apoie este projeto!

Se você gostou do Queiroz.js, por favor considere apoiar o desenvolvimento dessa extensão de código aberto com uma doação. Acesse [Support this project!](SUPPORT.md) para mais detalhes.

### Contribuindo

Por favor, consulte as [Diretrizes de Contribuição](../master/CONTRIBUTING.md) para obter mais detalhes.

### Agradecimentos

* **Matheus Barbieri**: Pelas diversas discussões, e constantes, sobre possíveis modificações envolvendo melhorias e novas funcionalidades. Pela sugestão, e código, de e para o uso de UserScript Managers. Obrigado.
* **Kelvin Klann**: Pela sugestão de uso do Gulp, entre outras dicas, facilitando a organização e controle do código, bem como minha vida de Desenvolvedor. Obrigado.
* **Aos demais**: Pelos bug reports e pelas novas ideias. Obrigado.

### Licença

Código licenciado sob os termos de [MIT License](../master/LICENSE).
