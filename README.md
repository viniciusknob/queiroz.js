# Queiroz.js 2.7.14
JavaScript Extension for Dimep Kairos

### Autor

* Vinícius M. Knob

### Contribuidores

* Matheus Barbieri
* Kelvin Klann

### Como utilizar

Manualmente:
1. Após efetuar login, acesse um dos menus de apresentação dos horários: Ponto ou Pedidos;
2. Abra as Ferramentas do Desenvolvedor;
3. Copie, cole e execute o código contido [aqui](../master/dist/queiroz.min.js).

Automatizado, utilizando como UserScript:
1. Copie a configuração contida [aqui](../master/UserScript.js);
2. Crie um novo script para execução em algum Gerenciador de Script.

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
* Pode ser executando nas telas Ponto e Pedidos;
* Adaptado para rodar como UserScript.

OBS: Todos os cálculos são efetuados a partir da primeira Segunda-feira, isso é necessário para não bagunçar o resultado final, e também por que o script se limita ao que está sendo apresentado na view.

### Versionamento

* 'gulp dev' gera uma versão de desenvolvimento adicionando um número ao final da versão. O número indica a data e hora sem sinais. Use esse recurso quantas vezes precisar durante o desenvolvimento. OBS: Antes de usá-lo, é necessário alterar a versão em Settings.VERSION no gulpfile.js.
* 'gulp release' normaliza a versão para x.x.x, preparando o código para ser commitado.

* 1.x.x : Drástica mudança na extenção, seja na estrutura ou na forma de apresentação.
* x.1.x : Mudanças relacionadas a novos recursos e plugins.
* x.x.1 : Correções de bugs, refatorações e pequenas modificações que não representem um risco.

### Licença

Código liberado sob [MIT License](../master/LICENSE).