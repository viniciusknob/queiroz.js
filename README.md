# Queiroz.js 2.7.3
JavaScript Extension for Dimep Kairos

#### Autor

* Vinícius M. Knob

#### Contribuidores

* Matheus Barbieri
* Kelvin Klann

#### Como utilizar

1. Após efetuar login, acesse um dos menus de apresentação dos horários: Ponto ou Pedidos;
2. Abra as Ferramentas do Desenvolvedor;
3. Copie, cole e execute o código contido [aqui](../master/dist/queiroz.min.js).

Obs: Se você utiliza um gerenciador de scripts, como Tampermonkey, NÃO é necessário adaptação, você pode utilizar a configuração contida [aqui](../master/Tampermonkey.js).

#### Recursos

* Cálculo de horas efetuadas por turno, quando não existe uma saída gravada, utiliza a hora atual.
* Cálculo de horas efetuadas por dia;
* Cálculo do total de horas efetuadas na semana;
* Cálculo do total de horas que faltam para completar a semana;
* Cálculo do total de horas extras na semana;
* Cálculo da hora estimada de saída quando faltam menos de 8h48min para completar 44h;
* Normal Mode: Calcula o total de horas iniciando da primeira Segunda-feira disponível na view;
* Last Week Mode: Possibilidade de calcular o total de horas efetuadas para semana anterior;
* Script pode ser executando nas telas Ponto e Pedidos;
* Adaptado para rodar utilizando plugins como Tampermonkey.

OBS: Todos os cálculos são efetuados a partir da primeira Segunda-feira, isso é necessário para não bagunçar o resultado final, e também por que o script se limita ao que está sendo apresentado na view.

#### Simbologia

* ~ : Quando não existe uma hora de saída, utiliza a hora atual;

#### Contribuindo...

1. git clone
2. npm rm --global gulp | npm install --global gulp-cli
3. npm install
4. Go ahead!

#### Versionamento

* 'gulp dev' gera uma versão de desenvolvimento adicionando um número ao final da versão. O número indica a data e hora sem sinais. Use esse recurso quantas vezes precisar durante o desenvolvimento. OBS: Antes de usá-lo, é necessário alterar a versão em Settings.VERSION no gulpfile.js.
* 'gulp release' normaliza a versão para x.x.x, preparando o código para ser commitado.

* 1.x.x : Drástica mudança na extenção, seja na estrutura ou na forma de apresentação.
* x.1.x : Mudanças relacionadas a novos recursos e plugins.
* x.x.1 : Correções de bugs, refatorações e pequenas modificações que não representem um risco.