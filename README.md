# Queiroz.js 2.6.0
JavaScript Extension for Dimep Kairos

#### Autor

* Vinícius M. Knob

#### Contribuidores

* Matheus Barbieri
* Kelvin Klann

#### Como utilizar

1. Após efetuar login, acesse um dos menus de apresentação dos horários: Ponto ou Pedidos;
2. Abra as Ferramentas do Desenvolvedor;
3. Copie, cole e execute o código contido em dist/queiroz.min.js.

Obs: Se preferir, pode ser utilizado um automatizador como Tampermonkey.

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

#### Simbologia

* ~ : Quando não existe uma hora de saída, utiliza a hora atual;
* = : Total de horas trabalhadas em um dia.

#### Contribuindo...

1. git clone
2. npm rm --global gulp | npm install --global gulp-cli
3. npm install
4. Go ahead!

#### Versionamento

* 'gulp dev' gera um incremento de número ao final da versão (#.#.#.1), assim pode-se controlar a versão do desenvolvimento. OBS: Antes de usá-lo, é necessário alterar a versão em Settings.VERSION no gulpfile.js.
* 'gulp release' normaliza a versão para #.#.#, preparando o código para ser commitado.