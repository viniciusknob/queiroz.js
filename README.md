# Queiroz.js 2.8.11
JavaScript Extension for Dimep Kairos

### Autor

* Vinícius M. Knob `<knob.vinicius@gmail.com>`

### Como utilizar

Manualmente:
1. Após efetuar login, acesse um dos menus de apresentação dos horários: Ponto ou Pedidos;
2. Abra as Ferramentas do Desenvolvedor;
3. Copie, cole e execute o código contido [aqui](../../raw/master/dist/queiroz.min.js).

Automatizado, utilizando como UserScript:
1. Instale um dos Gerenciadores de Script indicados abaixo;
2. Clique [aqui](../../raw/master/queiroz.user.js).

Indicados:
* Tampermonkey (Chrome)
* Greasemonkey (Firefox)

OBS: NÃO é necessário adaptação.

### Recursos

Cálculos considerando o dia:
* Total de horas efetuadas;
* Horas efetuadas por turno, quando não existe uma saída gravada, utiliza a hora atual;
* Hora de saída prevista (maior precisão após o intervalo de almoço);
* Saldo de horas considerando 08h48min.

Cálculos considerando a semana:
* Total de horas efetuadas;
* Total de horas pendentes;
* Total de horas extras;
* Saldo de horas;
* Hora estimada de saída quando faltam menos de 8h48min para completar 44h;

Outros recursos:
* Normal Mode: Calcula o total de horas a partir da primeira Segunda-feira disponível na view;
* Last Week Mode: Possibilidade de calcular o total de horas efetuadas para semana anterior;
* Pode ser executado nas telas Ponto e Pedidos;
* Adaptado para rodar como UserScript.

OBS: Todos os cálculos são efetuados a partir da primeira Segunda-feira, isso é necessário para não bagunçar o resultado final, e também por que o script se limita ao que está sendo apresentado na view.

### Contribuindo

Por favor, consulte as [Diretrizes de Contribuição](../master/CONTRIBUTING.md) para obter mais detalhes.

### Agradecimentos

* **Matheus Barbieri**: Pelas diversas discussões, e constantes, sobre possíveis modificações envolvendo melhorias e novas funcionalidades. Pela sugestão, e código, de e para o uso de UserScript Managers. Obrigado.
* **Kelvin Klann**: Pela sugestão de uso do Gulp, entre outras dicas, facilitando a organização e controle do código, bem como minha vida de Desenvolvedor. Obrigado.
* **Aos demais**: Pelos bug reports e pelas novas ideias. Obrigado.

### Licença

Código licenciado sob os termos de [MIT License](../master/LICENSE).
