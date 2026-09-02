  // ---------- TABS ----------
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.panel');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.panel).classList.add('active');
    });
  });

  // ---------- FUNCTION MACHINE ----------
  function runMachine(){
    const fn = document.getElementById('fn-select').value;
    const raw = document.getElementById('fn-input').value;
    const flowInput = document.getElementById('flow-input');
    const flowFn = document.getElementById('flow-fn');
    const flowOutput = document.getElementById('flow-output');
    const explain = document.getElementById('flow-explain');

    let inputDisplay, fnLabel, output, explanation;

    switch(fn){
      case 'len':
        inputDisplay = '"' + raw + '"';
        fnLabel = 'len( )';
        output = raw.length;
        explanation = `<code>len("${raw}")</code> cuenta los caracteres del texto y devuelve un número entero: ${raw.length}.`;
        break;
      case 'upper':
        inputDisplay = '"' + raw + '"';
        fnLabel = '.upper( )';
        output = '"' + raw.toUpperCase() + '"';
        explanation = `<code>"${raw}".upper()</code> devuelve el mismo texto, pero con todas las letras en mayúscula.`;
        break;
      case 'type':
        inputDisplay = raw;
        fnLabel = 'type( )';
        const esNumero = !isNaN(raw) && raw.trim() !== '';
        output = esNumero ? "&lt;class 'int'&gt;" : "&lt;class 'str'&gt;";
        explanation = esNumero
          ? `Como "${raw}" son solo dígitos, <code>type()</code> lo reconoce como un número entero (<code>int</code>).`
          : `Como "${raw}" contiene letras u otros caracteres, <code>type()</code> lo reconoce como texto (<code>str</code>).`;
        break;
      case 'reverse':
        inputDisplay = '"' + raw + '"';
        fnLabel = 'reversed( )';
        output = '"' + raw.split('').reverse().join('') + '"';
        explanation = `<code>reversed("${raw}")</code> recorre el texto de atrás hacia adelante y arma un nuevo texto invertido.`;
        break;
      case 'sum':
        inputDisplay = '[' + raw + ']';
        fnLabel = 'sum( )';
        const nums = raw.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        const total = nums.reduce((a,b) => a+b, 0);
        output = total;
        explanation = nums.length
          ? `<code>sum([${nums.join(', ')}])</code> suma todos los números de la lista y devuelve el total: ${total}.`
          : `Escribe números separados por coma, por ejemplo: 2, 5, 8`;
        break;
    }

    flowInput.textContent = inputDisplay;
    flowFn.textContent = fnLabel;
    flowOutput.textContent = output;
    explain.innerHTML = explanation;
  }

  document.getElementById('fn-select').addEventListener('change', (e) => {
    const placeholders = {
      len: 'hola',
      upper: 'hola mundo',
      type: '25',
      reverse: 'python',
      sum: '2, 5, 8'
    };
    document.getElementById('fn-input').value = placeholders[e.target.value];
    runMachine();
  });

  // ---------- QUIZ ----------
  const quizData = [
    {
      q: "¿Qué es una variable en Python?",
      options: [
        "Un nombre que usamos para guardar un valor y reutilizarlo",
        "Un tipo de bucle que repite código",
        "Una función incorporada de Python"
      ],
      correct: 0,
      explain: "La variable es el nombre que le damos a un valor guardado, para poder usarlo más adelante en el programa."
    },
    {
      q: "¿Cuál es la diferencia principal entre un for y un while?",
      options: [
        "No hay ninguna diferencia real",
        "for se usa cuando sabemos cuántas veces repetir; while, mientras se cumpla una condición",
        "while solo funciona con números y for solo con texto"
      ],
      correct: 1,
      explain: "El for recorre un conjunto conocido de elementos; el while repite mientras la condición siga siendo verdadera, sin saber de antemano cuántas veces."
    },
    {
      q: "En una función, ¿qué hace la palabra clave return?",
      options: [
        "Imprime un mensaje en pantalla",
        "Detiene el programa por completo",
        "Entrega un resultado que se puede usar en el resto del programa"
      ],
      correct: 2,
      explain: "return hace que la función devuelva un valor utilizable fuera de ella, por ejemplo para guardarlo en otra variable."
    },
    {
      q: "¿Qué tipo de dato es el resultado de 7 % 2?",
      options: [
        "float",
        "int",
        "bool"
      ],
      correct: 1,
      explain: "El operador % devuelve el resto de una división, y ese resto es un número entero (int)."
    },
    {
      q: "¿Qué diferencia hay entre parámetro y argumento?",
      options: [
        "Son exactamente lo mismo, solo cambia el nombre",
        "El parámetro es el nombre en la definición; el argumento es el valor real que se envía al llamarla",
        "El argumento se usa solo en funciones incorporadas"
      ],
      correct: 1,
      explain: "El parámetro aparece al definir la función; el argumento es el valor concreto que se le pasa cuando se ejecuta."
    }
  ];

  let score = 0;
  let answered = 0;

  function buildQuiz(){
    score = 0;
    answered = 0;
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';
    document.getElementById('quiz-score').classList.remove('show');

    quizData.forEach((item, qIndex) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';

      const qEl = document.createElement('p');
      qEl.className = 'q';
      qEl.textContent = `${qIndex + 1}. ${item.q}`;
      card.appendChild(qEl);

      const feedback = document.createElement('div');
      feedback.className = 'feedback';

      item.options.forEach((optText, optIndex) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'opt';
        optBtn.textContent = optText;
        optBtn.addEventListener('click', () => {
          if (optBtn.dataset.locked) return;
          const allOpts = card.querySelectorAll('.opt');
          allOpts.forEach(o => o.dataset.locked = "true");

          if (optIndex === item.correct){
            optBtn.classList.add('correct');
            score++;
          } else {
            optBtn.classList.add('wrong');
            allOpts[item.correct].classList.add('correct');
          }
          feedback.innerHTML = item.explain;
          feedback.classList.add('show');
          answered++;
          if (answered === quizData.length){
            showScore();
          }
        });
        card.appendChild(optBtn);
      });

      card.appendChild(feedback);
      container.appendChild(card);
    });
  }

  function showScore(){
    const el = document.getElementById('quiz-score');
    el.innerHTML = `Resultado: ${score} de ${quizData.length} correctas. <a href="#" onclick="buildQuiz(); return false;">Repetir autoevaluación</a>`;
    el.classList.add('show');
  }

  buildQuiz();

  // ---------- CODE EDITOR (Skulpt) ----------
  const examples = {
    funcion:
`def calcular_promedio(notas):
    suma = sum(notas)
    return suma / len(notas)

resultado = calcular_promedio([4.0, 3.5, 5.0])
print("El promedio es:", resultado)`,

    condicional:
`nota = 3.8

if nota >= 4.5:
    print("Aprobado")
elif nota >= 3.0:
    print("Necesita refuerzo")
else:
    print("Reprobado")`,

    bucle:
`for numero in range(1, 6):
    if numero % 2 == 0:
        print(numero, "es par")
    else:
        print(numero, "es impar")`,

    vacio:
`# Escribe tu propio código aquí
def mi_funcion():
    pass
`
  };

  function loadExample(key){
    document.getElementById('code-editor').value = examples[key];
    document.getElementById('console-output').innerHTML = '<span class="placeholder">Aún no has ejecutado este código.</span>';
    document.getElementById('run-status').textContent = '';
  }
  loadExample('funcion');

  function skulptOutput(text){
    const out = document.getElementById('console-output');
    if (out.querySelector('.placeholder')) out.innerHTML = '';
    out.textContent += text;
  }

  function skulptBuiltinRead(x){
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined){
      throw "Archivo no encontrado: '" + x + "'";
    }
    return Sk.builtinFiles["files"][x];
  }

  function runCode(){
    const code = document.getElementById('code-editor').value;
    const out = document.getElementById('console-output');
    const status = document.getElementById('run-status');
    out.innerHTML = '';
    status.textContent = 'Ejecutando…';

    Sk.pre = "console-output";
    Sk.configure({ output: skulptOutput, read: skulptBuiltinRead, execLimit: 8000 });

    Sk.misceval.asyncToPromise(function(){
      return Sk.importMainWithBody("<stdin>", false, code, true);
    }).then(function(){
      status.textContent = 'Ejecución terminada';
      if (out.textContent.trim() === ''){
        out.innerHTML = '<span class="placeholder">El código se ejecutó sin errores, pero no imprimió nada. Usa print() para ver resultados.</span>';
      }
    }, function(err){
      status.textContent = 'Hubo un error';
      const msg = err.toString();
      out.innerHTML += '<span class="err">' + msg + '</span>';
    });
  }
